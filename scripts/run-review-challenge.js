#!/usr/bin/env node
/**
 * Run review for a single challenge. Updates progress after.
 * The course review engine loads existing challenge-results.json, runs only this challenge,
 * merges (keeps other challenges' results, replaces this one), and writes back—so other challenges are not affected.
 * Usage: node scripts/run-review-challenge.js --course=01-react-fundamentals --challenge=01-static-task-display
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

function loadEnvFromRoot() {
  const envPath = join(ROOT_DIR, '.env');
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

function main() {
  loadEnvFromRoot();
  const args = process.argv.slice(2);
  const courseArg = args.find(a => a.startsWith('--course='));
  const challengeArg = args.find(a => a.startsWith('--challenge='));
  const courseId = courseArg ? courseArg.split('=')[1] : null;
  const challengeId = challengeArg ? challengeArg.split('=')[1] : null;
  if (!courseId || !challengeId) {
    console.error('Usage: node scripts/run-review-challenge.js --course=<courseId> --challenge=<challengeId>');
    console.error('Example: node scripts/run-review-challenge.js --course=01-react-fundamentals --challenge=01-static-task-display');
    process.exit(1);
  }

  const courseDir = join(ROOT_DIR, 'courses', courseId);
  const reviewScript = join(courseDir, 'review-engine', 'index.js');
  if (!existsSync(reviewScript)) {
    console.error(`❌ Review engine not found: ${courseId}`);
    process.exit(1);
  }

  console.log(`📝 Reviewing ${courseId} → ${challengeId}\n`);
  execSync(`node "${reviewScript}" --challenge=${challengeId}`, {
    cwd: courseDir,
    stdio: 'inherit',
    env: { ...process.env },
  });
  console.log('\n📊 Updating progress...');
  execSync('node scripts/update-progress.js', { cwd: ROOT_DIR, stdio: 'inherit' });
  console.log('\n✅ Done.');
}

main();
