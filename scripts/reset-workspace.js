#!/usr/bin/env node

/**
 * Restore challenge implementation files and saved review results to the clone state.
 *
 * The command previews by default. Pass --confirm to apply it. Before applying,
 * changed and untracked files in the selected paths are saved to a Git stash.
 */

import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASELINE = '0e1305f85f2812c391905bc1f6f4fb9e8c687a11';
const COURSES = [
  '01-react-fundamentals',
  '02-redux-rtk-query',
  '03-nextjs-app-router',
];
const CHALLENGE_CODE_PATHS = {
  '01-react-fundamentals': ['courses/01-react-fundamentals/project/src'],
  '02-redux-rtk-query': ['courses/02-redux-rtk-query/project/src'],
  '03-nextjs-app-router': [
    'courses/03-nextjs-app-router/project/app',
    'courses/03-nextjs-app-router/project/public/nextjs-app-router.svg',
  ],
};
const PRESERVED_FILES = [
  // Keep the README viewer and its challenge-card link fix; they are engine UI support.
  'courses/03-nextjs-app-router/project/app/challenges/[id]/page.tsx',
  'courses/03-nextjs-app-router/project/app/components/ChallengeList.tsx',
];

function runGit(args, { capture = false } = {}) {
  const result = spawnSync('git', args, {
    cwd: ROOT_DIR,
    encoding: 'utf8',
    stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed with exit code ${result.status}`);
  }
  return capture ? result.stdout.trim() : '';
}

function parseArgs(args) {
  const options = { confirm: false, resultsOnly: false, course: null };

  for (const arg of args) {
    if (arg === '--confirm') options.confirm = true;
    else if (arg === '--results-only') options.resultsOnly = true;
    else if (arg.startsWith('--course=')) options.course = arg.slice('--course='.length);
    else throw new Error(`Unknown option: ${arg}`);
  }

  if (options.course && !COURSES.includes(options.course)) {
    throw new Error(`Unknown course "${options.course}". Choose: ${COURSES.join(', ')}`);
  }
  return options;
}

function getPlan({ resultsOnly, course }) {
  const selectedCourses = course ? [course] : COURSES;
  const resetPaths = [];

  for (const courseId of selectedCourses) {
    if (!resultsOnly) {
      resetPaths.push(...CHALLENGE_CODE_PATHS[courseId]);
    }
    resetPaths.push(`courses/${courseId}/project/README.md`);
    resetPaths.push(`courses/${courseId}/results`);
  }

  const inspectPaths = [...resetPaths];
  if (!course) {
    // Aggregate progress and README evidence are part of the all-course clone state.
    resetPaths.push('learner-results/progress.json', 'README.md');
    inspectPaths.push('learner-results/progress.json', 'README.md');
  } else {
    // A one-course reset recomputes aggregate progress and its generated README evidence.
    inspectPaths.push('learner-results/progress.json', 'README.md');
    inspectPaths.push(...COURSES.map(id => `courses/${id}/project/README.md`));
  }

  return {
    resetPaths: [...new Set(resetPaths)],
    inspectPaths: [...new Set(inspectPaths)],
  };
}

function listChangedPaths(paths) {
  const tracked = runGit(
    ['diff', '--name-only', '--no-renames', BASELINE, '--', ...paths],
    { capture: true },
  ).split(/\r?\n/).filter(Boolean);
  const untracked = runGit(
    ['ls-files', '--others', '--exclude-standard', '--', ...paths],
    { capture: true },
  ).split(/\r?\n/).filter(Boolean);
  const preserved = new Set(PRESERVED_FILES);

  return {
    tracked: [...new Set(tracked)].filter(file => !preserved.has(file)).sort(),
    untracked: [...new Set(untracked)].filter(file => !preserved.has(file)).sort(),
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  runGit(['cat-file', '-e', `${BASELINE}^{commit}`]);

  const { resetPaths, inspectPaths } = getPlan(options);
  const { tracked, untracked } = listChangedPaths(inspectPaths);
  const changedPaths = [...new Set([...tracked, ...untracked])].sort();

  console.log(`Reset baseline: ${BASELINE}`);
  console.log(`Scope: ${options.course ?? 'all courses'}${options.resultsOnly ? ' (results only)' : ' (project code and results)'}`);
  if (changedPaths.length === 0) {
    console.log('No differences found in the selected paths.');
  } else {
    console.log(`Files that differ from the clone state (${changedPaths.length}):`);
    for (const file of changedPaths) console.log(`  ${file}`);
  }
  if (options.course) {
    console.log('A one-course reset will also rebuild learner progress and generated README evidence from all course results.');
  }

  if (!options.confirm) {
    console.log('\nPreview only; no files were changed. Add --confirm to apply this reset.');
    return;
  }

  if (changedPaths.length > 0) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const exactPathspecs = changedPaths.map(file => `:(literal)${file}`);
    runGit([
      'stash', 'push', '--include-untracked',
      '--message', `pre-reset-workspace-${timestamp}`,
      '--', ...exactPathspecs,
    ]);

    const resetTracked = tracked
      .filter(file => resetPaths.some(path => file === path || file.startsWith(`${path}/`)))
      .map(file => `:(literal)${file}`);
    const resetUntracked = untracked
      .filter(file => resetPaths.some(path => file === path || file.startsWith(`${path}/`)))
      .map(file => `:(literal)${file}`);

    if (resetTracked.length > 0) {
      runGit(['restore', `--source=${BASELINE}`, '--worktree', '--', ...resetTracked]);
    }
    if (resetUntracked.length > 0) {
      runGit(['clean', '-f', '--', ...resetUntracked]);
    }
  }

  const selectedResultPrefix = options.course
    ? `courses/${options.course}/results/`
    : null;
  const shouldRefreshProgress = options.course && changedPaths.some(file =>
    file.startsWith(selectedResultPrefix),
  );

  if (shouldRefreshProgress) {
    const update = spawnSync(process.execPath, [join(ROOT_DIR, 'scripts', 'update-progress.js')], {
      cwd: ROOT_DIR,
      stdio: 'inherit',
    });
    if (update.error) throw update.error;
    if (update.status !== 0) {
      throw new Error('Progress refresh failed. Run "npm run progress:update" to refresh the aggregate files.');
    }
  }

  console.log('\nReset complete. The pre-reset files are saved in Git stash; inspect them with:');
  console.log('  git stash list');
}

try {
  main();
} catch (error) {
  console.error(`Reset failed: ${error.message}`);
  process.exitCode = 1;
}
