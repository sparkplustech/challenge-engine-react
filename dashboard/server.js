#!/usr/bin/env node
/**
 * Dashboard API server. Serves progress, courses, challenges, and can run reviews.
 * Production: serve static UI from ../dashboard/app/dist (build the app first).
 */

import express from 'express';
import cors from 'cors';
import { readFileSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Repo root: server runs from dashboard/, so __dirname is dashboard; repo root is parent.
// Fallback: if "courses" not found from __dirname/.., try cwd/.. (when run as "cd dashboard && node server.js", cwd is dashboard).
let ROOT = resolve(join(__dirname, '..'));
if (!existsSync(join(ROOT, 'courses'))) {
  ROOT = resolve(process.cwd(), '..');
}

// Load .env from repo root so spawned review processes inherit GROQ_API_KEY
function loadEnvFromRoot() {
  const envPath = join(ROOT, '.env');
  if (!existsSync(envPath)) return;
  try {
    const content = readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const match = line.match(/^\s*GROQ_API_KEY\s*=\s*(.+?)\s*$/);
      if (match) {
        process.env.GROQ_API_KEY = match[1].trim().replace(/^["']|["']$/g, '');
        break;
      }
    }
  } catch (_) {}
}
loadEnvFromRoot();

// Use 7700 by default to avoid conflict with course dev servers (Vite 5173, Next 3000, etc.)
const PORT = process.env.DASHBOARD_PORT || 7700;

const app = express();
app.use(cors());
app.use(express.json());

function getProgress() {
  const path = join(ROOT, 'learner-results', 'progress.json');
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function getPathway() {
  const path = join(ROOT, 'pathway-review', 'pathway-config.json');
  if (!existsSync(path)) return { pathwayName: 'Pathway', courses: [] };
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function getCourseConfig(courseId) {
  const path = join(ROOT, 'courses', courseId, 'course-config.json');
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function getChallengeMetadata(courseId, challengeId) {
  const filePath = resolve(ROOT, 'courses', courseId, 'project', 'challenges', challengeId, 'metadata.json');
  let contents = null;
  if (existsSync(filePath)) {
    try {
      contents = readFileSync(filePath, 'utf-8');
    } catch (_) {}
  }
  // Fallback when server runs from dashboard/ and ROOT might not be repo root
  if (!contents) {
    const altPath = resolve(process.cwd(), '..', 'courses', courseId, 'project', 'challenges', challengeId, 'metadata.json');
    if (existsSync(altPath)) {
      try {
        contents = readFileSync(altPath, 'utf-8');
      } catch (_) {}
    }
  }
  if (!contents) return null;
  try {
    return JSON.parse(contents);
  } catch (_) {
    return null;
  }
}

function getChallengeReadme(courseId, challengeId) {
  const path = join(ROOT, 'courses', courseId, 'project', 'challenges', challengeId, 'README.md');
  if (!existsSync(path)) return null;
  return readFileSync(path, 'utf-8');
}

function getChallengeResults(courseId) {
  const path = join(ROOT, 'courses', courseId, 'results', 'challenge-results.json');
  if (!existsSync(path)) return [];
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function getAIFeedback(courseId) {
  const path = join(ROOT, 'courses', courseId, 'results', 'ai-feedback.json');
  if (!existsSync(path)) return [];
  const data = JSON.parse(readFileSync(path, 'utf-8'));
  return Array.isArray(data) ? data : [];
}

// GET /api/progress
app.get('/api/progress', (req, res) => {
  const progress = getProgress();
  res.json(progress || { lastUpdated: null, pathway: {}, courses: {} });
});

// GET /api/courses - list with pagination (page, limit)
app.get('/api/courses', (req, res) => {
  const pathway = getPathway();
  const courses = pathway.courses || [];
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const start = (page - 1) * limit;
  const slice = courses.slice(start, start + limit);
  const progress = getProgress();
  const withProgress = slice.map(c => {
    const courseProgress = progress?.courses?.[c.id] || {};
    return {
      id: c.id,
      name: c.name,
      weight: c.weight,
      ...courseProgress,
    };
  });
  res.json({
    courses: withProgress,
    total: courses.length,
    page,
    limit,
    totalPages: Math.ceil(courses.length / limit),
  });
});

// GET /api/courses/:courseId
app.get('/api/courses/:courseId', (req, res) => {
  const config = getCourseConfig(req.params.courseId);
  if (!config) return res.status(404).json({ error: 'Course not found' });
  const progress = getProgress();
  const courseProgress = progress?.courses?.[req.params.courseId] || {};
  res.json({ ...config, ...courseProgress });
});

// GET /api/courses/:courseId/challenges - paginated
app.get('/api/courses/:courseId/challenges', (req, res) => {
  const config = getCourseConfig(req.params.courseId);
  if (!config) return res.status(404).json({ error: 'Course not found' });
  const challenges = config.challenges || [];
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(200, Math.max(1, parseInt(req.query.limit, 10) || 50));
  const start = (page - 1) * limit;
  const slice = challenges.slice(start, start + limit);
  const progress = getProgress();
  const courseChallenges = progress?.courses?.[req.params.courseId]?.challenges || {};
  const courseId = req.params.courseId;
  const withProgress = slice.map(c => ({
    ...c,
    passed: courseChallenges[c.id]?.passed,
    score: courseChallenges[c.id]?.score,
    lastRun: courseChallenges[c.id]?.lastRun,
  }));
  res.json({
    challenges: withProgress,
    total: challenges.length,
    page,
    limit,
    totalPages: Math.ceil(challenges.length / limit),
  });
});

// GET /api/courses/:courseId/challenges/:challengeId - detail, instructions, results
app.get('/api/courses/:courseId/challenges/:challengeId', (req, res) => {
  const { courseId, challengeId } = req.params;
  const config = getCourseConfig(courseId);
  if (!config) return res.status(404).json({ error: 'Course not found' });
  const challenge = (config.challenges || []).find(c => c.id === challengeId);
  if (!challenge) return res.status(404).json({ error: 'Challenge not found' });
  const metadata = getChallengeMetadata(courseId, challengeId);
  const readme = getChallengeReadme(courseId, challengeId);
  const results = getChallengeResults(courseId);
  const result = results.find(r => r.challengeId === challengeId);
  const aiFeedback = getAIFeedback(courseId);
  const ai = aiFeedback.find(f => f.challengeId === challengeId)?.aiReview || null;
  const progress = getProgress();
  const chProgress = progress?.courses?.[courseId]?.challenges?.[challengeId] || {};
  res.json({
    ...challenge,
    metadata: metadata || {},
    skills: metadata?.skills ?? [],
    instructions: readme || '',
    result: result || null,
    aiFeedback: ai,
    ...chProgress,
  });
});

// POST /api/review - run review in background so server stays responsive (no blocking)
app.post('/api/review', (req, res) => {
  const { courseId, challengeId } = req.body || {};
  if (!courseId || !challengeId) {
    return res.status(400).json({ error: 'courseId and challengeId required' });
  }
  const script = join(ROOT, 'scripts', 'run-review-challenge.js');
  if (!existsSync(script)) {
    return res.status(500).json({ error: 'Review script not found' });
  }
  loadEnvFromRoot();
  const child = spawn('node', [script, `--course=${courseId}`, `--challenge=${challengeId}`], {
    cwd: ROOT,
    stdio: 'ignore',
    env: { ...process.env },
    detached: true,
  });
  child.unref(); // allow server to keep running without waiting for child
  // Respond immediately so other requests (e.g. back to challenges) are not blocked
  const progress = getProgress();
  res.json({ ok: true, progress, started: true });
});

// Serve static UI if built
const staticDir = join(__dirname, 'app', 'dist');
if (existsSync(staticDir)) {
  app.use(express.static(staticDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(join(staticDir, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>Challenge Engine Dashboard</title></head>
        <body>
          <h1>Challenge Engine Dashboard</h1>
          <p>API is running. Build the UI: <code>cd dashboard/app && npm install && npm run build</code></p>
          <p>Then restart the server. Or use the API directly:</p>
          <ul>
            <li><a href="/api/progress">GET /api/progress</a></li>
            <li><a href="/api/courses">GET /api/courses</a></li>
          </ul>
        </body>
      </html>
    `);
  });
}

app.listen(PORT, () => {
  console.log(`Dashboard server at http://localhost:${PORT}`);
  if (!existsSync(staticDir)) {
    console.log('Build UI: cd dashboard/app && npm install && npm run build');
  }
});
