#!/usr/bin/env node
/**
 * Test AI review connection to Groq API.
 * Run from repo root: node scripts/test-ai-review.js
 * Requires: GROQ_API_KEY in environment or .env file
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Load .env from repo root if it exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, '..');
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

async function testConnection() {
  console.log('Testing AI review (Groq API) connection...\n');

  if (!GROQ_API_KEY) {
    console.log('❌ GROQ_API_KEY is not set.');
    console.log('   Set it in your environment or .env, then run: node scripts/test-ai-review.js');
    process.exit(1);
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'user', content: 'Reply with exactly: OK' }
        ],
        max_tokens: 256
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const msg = data?.error?.message || data?.error || response.statusText;
      console.log(`❌ Groq API error (${response.status}): ${msg}`);
      if (response.status === 401) {
        console.log('   Check that GROQ_API_KEY is valid (get one at https://console.groq.com).');
      }
      process.exit(1);
    }

    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== 'string' || !content.trim()) {
      console.log('❌ Groq API returned no content.');
      process.exit(1);
    }

    console.log('✅ AI review is connected and responding.');
    console.log('   Sample response:', content.trim().slice(0, 80));
    console.log('\n   You can run a course review; AI review will use this key.');
  } catch (err) {
    console.log('❌ Connection failed:', err.message);
    if (err.cause) console.log('   Cause:', err.cause);
    process.exit(1);
  }
}

testConnection();
