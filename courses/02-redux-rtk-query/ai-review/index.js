#!/usr/bin/env node

/**
 * AI Review Layer for RTK Query Course
 * 
 * Uses Groq API (GPT-OSS 20B) to provide qualitative code review
 * 
 * IMPORTANT: This review only runs if functional tests pass.
 * It receives:
 * - Challenge instructions and requirements (README.md - merged file)
 * - All user-created code files
 * 
 * Provides sophisticated feedback based on actual implementation vs requirements.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

// Load .env from repo root if it exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, '..', '..', '..');
const envPath = join(repoRoot, '.env');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^\s*GROQ_API_KEY\s*=\s*(.+?)\s*$/);
    if (match) {
      process.env.GROQ_API_KEY = match[1].trim().replace(/^["']|["']$/g, '');
      break;
    }
  }
}

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'openai/gpt-oss-20b';

// File extensions to include in code review
const CODE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

// Groq counts prompt + max_tokens against the 8000 tokens-per-minute limit, so these two must fit together
const MAX_CODE_CHARS = 14000; // Total code sent to the model (about 3500 tokens)
const MAX_COMPLETION_TOKENS = 2000; // Includes the model's hidden reasoning, not just the answer

const MAX_ATTEMPTS = 3;
const DEFAULT_RETRY_WAIT_MS = 10000;
const MAX_RETRY_WAIT_MS = 90000; // Longer waits mean a daily quota, not a per-minute one

/**
 * Reviews code using AI for qualitative feedback
 * @param {string} challengeId - Challenge ID
 * @param {object} challengeMetadata - Challenge metadata (includes filesToCheck, patternsRequired, etc.)
 * @param {string} projectDir - Project directory path
 */
export async function reviewCodeWithAI(challengeId, challengeMetadata, projectDir) {
  const results = {
    challengeId,
    timestamp: new Date().toISOString(),
    score: 0,
    feedback: [],
    strengths: [],
    improvements: [],
    readability: 0,
    maintainability: 0,
    overall: ''
  };

  try {
    // 1. Load challenge instructions and requirements from README.md (merged file)
    const challengeDir = join(projectDir, 'challenges', challengeId);
    const readmePath = join(challengeDir, 'README.md');
    
    let challengeInstructions = '';
    let challengeRequirements = '';

    if (existsSync(readmePath)) {
      const readmeContent = readFileSync(readmePath, 'utf-8');
      // Split README into instructions (before Technical Requirements) and requirements (after)
      const requirementsMatch = readmeContent.match(/## Technical Requirements(?: \(What Will Be Reviewed\))?/);
      if (requirementsMatch) {
        const splitIndex = requirementsMatch.index;
        challengeInstructions = readmeContent.substring(0, splitIndex);
        challengeRequirements = readmeContent.substring(splitIndex);
      } else {
        // If no Technical Requirements section, use entire README as instructions
        challengeInstructions = readmeContent;
      }
    }

    // 2. Read all user-created code files
    const codeFiles = [];
    const missingFiles = [];
    
    for (const filePath of challengeMetadata.filesToCheck || []) {
      const fullPath = join(projectDir, filePath);
      if (existsSync(fullPath)) {
        const content = readFileSync(fullPath, 'utf-8');
        // Only include if it's a code file and has meaningful content
        if (CODE_EXTENSIONS.includes(extname(fullPath)) && content.trim().length > 0) {
          codeFiles.push({
            file: filePath,
            content: content.substring(0, 8000) // Limit to 8KB per file
          });
        }
      } else {
        missingFiles.push(filePath);
      }
    }

    // 3. Discover additional files user might have created in relevant directories
    const additionalFiles = discoverAdditionalFiles(challengeMetadata, projectDir);
    for (const file of additionalFiles) {
      // Avoid duplicates
      if (!codeFiles.some(f => f.file === file.file)) {
        codeFiles.push(file);
      }
    }

    if (codeFiles.length === 0) {
      return {
        ...results,
        error: 'No code files found to review. User must create the required files first.',
        score: 0
      };
    }

    const { includedFiles, omittedFiles } = limitCodeContext(codeFiles);

    // 4. Check if API key is available
    if (!GROQ_API_KEY) {
      return {
        ...results,
        error: 'GROQ_API_KEY environment variable not set. AI review skipped.',
        score: 0
      };
    }

    // 5. Build sophisticated prompt with all context
    const prompt = buildReviewPrompt(
      challengeId,
      challengeMetadata,
      challengeInstructions,
      challengeRequirements,
      includedFiles,
      missingFiles,
      omittedFiles
    );

    // 6. Call Groq API
    const aiResponse = await callGroqAPI(prompt);

    // 7. Parse response
    const parsedResponse = parseAIResponse(aiResponse);

    return {
      ...results,
      ...parsedResponse,
      score: calculateAIScore(parsedResponse)
    };

  } catch (error) {
    return {
      ...results,
      error: error.message,
      score: 0,
      skipped: true
    };
  }
}

/**
 * Keep code within MAX_CODE_CHARS. filesToCheck come first in codeFiles, so discovered files are dropped first.
 */
function limitCodeContext(codeFiles) {
  const includedFiles = [];
  const omittedFiles = [];
  let remaining = MAX_CODE_CHARS;

  for (const file of codeFiles) {
    if (remaining <= 0) {
      omittedFiles.push(file.file);
      continue;
    }
    if (file.content.length > remaining) {
      omittedFiles.push(`${file.file} (partially)`);
    }
    includedFiles.push({ ...file, content: file.content.substring(0, remaining) });
    remaining -= file.content.length;
  }

  return { includedFiles, omittedFiles };
}

/**
 * Discover additional files user might have created
 */
function discoverAdditionalFiles(challengeMetadata, projectDir) {
  const additionalFiles = [];
  const checkedDirs = new Set();

  // Check directories mentioned in filesToCheck
  for (const filePath of challengeMetadata.filesToCheck || []) {
    const dir = dirname(filePath);
    if (!checkedDirs.has(dir)) {
      checkedDirs.add(dir);
      const fullDir = join(projectDir, dir);
      if (existsSync(fullDir)) {
        try {
          const files = readdirSync(fullDir);
          for (const file of files) {
            const fullPath = join(fullDir, file);
            if (statSync(fullPath).isFile() && CODE_EXTENSIONS.includes(extname(file))) {
              const relativePath = join(dir, file).replace(/\\/g, '/');
              // Only include if not already in filesToCheck
              if (!challengeMetadata.filesToCheck.includes(relativePath)) {
                try {
                  const content = readFileSync(fullPath, 'utf-8');
                  if (content.trim().length > 0) {
                    additionalFiles.push({
                      file: relativePath,
                      content: content.substring(0, 8000)
                    });
                  }
                } catch (e) {
                  // Skip files that can't be read
                }
              }
            }
          }
        } catch (e) {
          // Skip directories that can't be read
        }
      }
    }
  }

  return additionalFiles;
}

/**
 * Build sophisticated review prompt with all context
 */
function buildReviewPrompt(challengeId, challengeMetadata, instructions, requirements, codeFiles, missingFiles, omittedFiles) {
  const challengeName = challengeMetadata.challengeName || challengeId;
  const skills = challengeMetadata.skills || [];
  const patternsRequired = challengeMetadata.patternsRequired || [];

  // Build code context
  const codeContext = codeFiles.map(f => 
    `File: ${f.file}\n\`\`\`typescript\n${f.content}\n\`\`\``
  ).join('\n\n---\n\n');

  // Build missing files note
  const missingFilesNote = missingFiles.length > 0
    ? `\n\n⚠️ NOTE: The following expected files are missing: ${missingFiles.join(', ')}. This may indicate incomplete implementation.`
    : '';

  // Omitted files exist, so the model must not treat them as missing or incomplete
  const omittedFilesNote = omittedFiles.length > 0
    ? `\n\nNOTE: To fit the size limit, these files exist but were not shown: ${omittedFiles.join(', ')}. Do not count them as missing or incomplete.`
    : '';

  // Build requirements summary
  const requirementsSummary = requirements
    ? `\n\n## Technical Requirements:\n${requirements.substring(0, 2000)}`
    : '';

  // Build instructions summary
  const instructionsSummary = instructions
    ? `\n\n## Challenge Instructions:\n${instructions.substring(0, 3000)}`
    : '';

  return `You are an expert RTK Query, Redux Toolkit, and TypeScript code reviewer. Review the following implementation for challenge "${challengeName}" (${challengeId}).

## Challenge Context:
- **Challenge ID**: ${challengeId}
- **Skills Focus**: ${skills.join(', ')}
- **Required Patterns**: ${patternsRequired.join(', ')}${instructionsSummary}${requirementsSummary}

## User's Implementation:

The following code files were created/modified by the user for this challenge:

${codeContext}${missingFilesNote}${omittedFilesNote}

## Review Task:

Provide a comprehensive code review focusing on:

1. **Requirement Compliance** (30%):
   - Does the code meet all functional requirements?
   - Are all required patterns implemented correctly?
   - Are missing files a concern?

2. **Code Quality** (25%):
   - Readability: Is the code clear and well-structured?
   - TypeScript usage: Proper types and interfaces?
   - Code organization: Logical structure and separation of concerns?

3. **RTK Query Best Practices** (25%):
   - Correct use of createApi, fetchBaseQuery, endpoints
   - Proper hook usage (useGetUsersQuery, etc.)
   - Store integration and reducer setup
   - Error and loading state handling

4. **Maintainability** (20%):
   - Is the code maintainable and extensible?
   - Are there any code smells or anti-patterns?
   - Could the code be improved for future changes?

## Output Format:

Provide your review as JSON:

{
  "readability": <number 0-100>,
  "maintainability": <number 0-100>,
  "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
  "improvements": ["specific improvement 1 with file reference", "specific improvement 2 with file reference", "specific improvement 3 with file reference"],
  "overall": "<2-3 sentence assessment focusing on requirement compliance and RTK Query best practices>",
  "requirementCompliance": <number 0-100, how well requirements are met>
}

Be specific in your feedback. Reference specific files and code patterns. Focus on actionable improvements.`;
}

/**
 * Call Groq API
 */
async function callGroqAPI(prompt) {
  let lastError;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are an expert RTK Query, Redux Toolkit, and TypeScript code reviewer. Provide detailed, specific, actionable feedback. Reference specific files and code patterns in your feedback.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: MAX_COMPLETION_TOKENS,
        reasoning_effort: 'low', // Leave the token budget for the answer
        response_format: { type: 'json_object' }
      })
    });

    const data = await response.json().catch(() => ({}));

    if (response.status === 429) {
      const waitMs = getRetryWaitMs(response, data);
      lastError = new Error(`Groq API error (429): ${data?.error?.message || response.statusText}`);
      if (waitMs > MAX_RETRY_WAIT_MS) throw lastError;
      if (attempt < MAX_ATTEMPTS) await new Promise(resolve => setTimeout(resolve, waitMs));
      continue;
    }

    if (!response.ok) {
      const msg = data?.error?.message || data?.error || response.statusText;
      lastError = new Error(`Groq API error (${response.status}): ${msg}`);
      if (data?.error?.code === 'json_validate_failed') continue; // Model produced invalid JSON
      throw lastError;
    }

    const choice = data?.choices?.[0];
    if (choice?.finish_reason === 'length') {
      lastError = new Error(`AI response was cut off at ${MAX_COMPLETION_TOKENS} tokens. AI review skipped.`);
      continue;
    }

    const content = choice?.message?.content;
    if (content == null || typeof content !== 'string') {
      throw new Error('Groq API returned no content (check model/response shape)');
    }
    return content;
  }

  throw lastError;
}

/**
 * How long Groq asked us to wait: retry-after header first, then the error message
 */
function getRetryWaitMs(response, data) {
  const retryAfter = Number(response.headers.get('retry-after'));
  if (retryAfter > 0) return retryAfter * 1000 + 1000;

  const match = String(data?.error?.message || '').match(/try again in (\d+(?:\.\d+)?)s/i);
  return match ? Math.ceil(parseFloat(match[1]) * 1000) + 1000 : DEFAULT_RETRY_WAIT_MS;
}

/**
 * Parse AI response
 */
function parseAIResponse(response) {
  try {
    // Try to extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        readability: parsed.readability || 0,
        maintainability: parsed.maintainability || 0,
        strengths: parsed.strengths || [],
        improvements: parsed.improvements || [],
        overall: parsed.overall || '',
        requirementCompliance: parsed.requirementCompliance || 0
      };
    }
  } catch (error) {
    // Fallback parsing
  }

  // Fallback: extract information manually
  const readabilityMatch = response.match(/"?readability"?\s*:?\s*(\d+)/i);
  const maintainabilityMatch = response.match(/"?maintainability"?\s*:?\s*(\d+)/i);
  const complianceMatch = response.match(/"?requirementCompliance"?\s*:?\s*(\d+)/i);

  // A guessed score would be misleading, so report the review as failed instead
  if (!readabilityMatch || !maintainabilityMatch || !complianceMatch) {
    throw new Error('Could not read scores from the AI response. AI review skipped.');
  }

  return {
    readability: parseInt(readabilityMatch[1]),
    maintainability: parseInt(maintainabilityMatch[1]),
    requirementCompliance: parseInt(complianceMatch[1]),
    strengths: extractList(response, /strengths?/i),
    improvements: extractList(response, /improvements?/i),
    overall: response.substring(0, 500)
  };
}

/**
 * Extract list items from text
 */
function extractList(text, keyword) {
  const lines = text.split('\n');
  const list = [];
  let inList = false;
  const matchesKeyword = (line) =>
    typeof keyword === 'string'
      ? line.toLowerCase().includes(keyword)
      : keyword.test(line);

  for (const line of lines) {
    if (matchesKeyword(line)) {
      inList = true;
      continue;
    }
    if (inList && (line.trim().startsWith('-') || line.trim().match(/^\d+\./) || line.trim().startsWith('"'))) {
      let item = line.trim().replace(/^[-•\d."]+\s*/, '').replace(/^["']|["']$/g, '');
      if (item) {
        list.push(item);
        if (list.length >= 5) break; // Allow up to 5 items
      }
    }
    if (inList && line.trim() === '' && list.length > 0) {
      break;
    }
  }

  return list.length > 0 ? list : [];
}

/**
 * Calculate AI score based on multiple factors
 */
function calculateAIScore(parsedResponse) {
  const readability = parsedResponse.readability || 0;
  const maintainability = parsedResponse.maintainability || 0;
  const requirementCompliance = parsedResponse.requirementCompliance || 0;

  // Weighted average: requirement compliance is most important
  // Since tests already passed, we focus on code quality
  const score = Math.round(
    (requirementCompliance * 0.4) +
    (readability * 0.3) +
    (maintainability * 0.3)
  );

  return Math.max(0, Math.min(100, score)); // Clamp between 0-100
}
