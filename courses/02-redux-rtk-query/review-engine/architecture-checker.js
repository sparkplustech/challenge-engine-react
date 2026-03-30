import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

/**
 * File-specific pattern rules
 */
function getFileSpecificPatterns(file) {
  if (file.includes("api/usersApi")) {
    return ["createApi", "fetchBaseQuery", "endpoints"];
  }
  if (file.includes("store")) {
    return ["reducer", "middleware"];
  }
  if (file.includes("UsersList")) {
    return ["useQueryHook"];
  }
  if (file.includes("main") || file.includes("index")) {
    return ["Provider"];
  }
  return [];
}

/**
 * Main checker
 */
export async function checkArchitecture(challengeMetadata, projectDir) {
  const filesToCheck = challengeMetadata.filesToCheck || [];

  const results = {
    score: 0,
    passed: false,
    patternsFound: [],
    patternsMissing: [],
    details: []
  };

  let totalChecks = 0;
  let passedChecks = 0;

  for (const file of filesToCheck) {
    const filePath = join(projectDir, file);
    const patternsRequired = getFileSpecificPatterns(file);

    if (!existsSync(filePath)) {
      results.details.push({
        file,
        error: 'File does not exist',
        patternsFound: [],
        patternsMissing: patternsRequired
      });
      continue;
    }

    const fileContent = readFileSync(filePath, 'utf-8');

    const fileResults = checkFileForPatterns(
      fileContent,
      patternsRequired
    );

    totalChecks += patternsRequired.length;
    passedChecks += fileResults.patternsFound.length;

    results.patternsFound.push(...fileResults.patternsFound);
    results.patternsMissing.push(...fileResults.patternsMissing);

    results.details.push({
      file,
      patternsFound: fileResults.patternsFound,
      patternsMissing: fileResults.patternsMissing
    });
  }

  // final score
  results.score = totalChecks > 0
    ? Math.round((passedChecks / totalChecks) * 100 * 10) / 10
    : 100;

  results.passed = results.score >= 80;

  return results;
}

/**
 * AST + fallback checker
 */
function checkFileForPatterns(content, patternsRequired) {
  const patternsFound = [];
  const patternsMissing = [];

  try {
    const ast = parse(content, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx']
    });

    const foundPatterns = new Set();

    traverse(ast, {
      CallExpression(path) {
        const callee = path.node.callee;

        if (callee.name === 'createApi') {
          foundPatterns.add('createApi');
        }

        if (callee.name === 'fetchBaseQuery') {
          foundPatterns.add('fetchBaseQuery');
        }

        if (callee.name && /use.*Query/i.test(callee.name)) {
          foundPatterns.add('useQueryHook');
        }

        if (callee.name && /use.*Mutation/i.test(callee.name)) {
          foundPatterns.add('useMutationHook');
        }

        if (
          callee.property &&
          callee.property.name === 'updateQueryData'
        ) {
          foundPatterns.add('optimisticUpdate');
        }

        if (
          callee.type === 'MemberExpression' &&
          callee.object?.name === 'builder' &&
          callee.property?.name === 'mutation'
        ) {
          foundPatterns.add('mutation');
        }
      },

      ObjectProperty(path) {
        const key = path.node.key?.name;

        if (key === 'endpoints') {
          foundPatterns.add('endpoints');
        }

        if (key === 'providesTags') {
          foundPatterns.add('providesTags');
        }

        if (key === 'invalidatesTags') {
          foundPatterns.add('invalidatesTags');
        }

        if (key === 'tagTypes') {
          foundPatterns.add('tagTypes');
        }

        if (key === 'onQueryStarted') {
          foundPatterns.add('onQueryStarted');
        }

        if (key === 'reducer') {
          foundPatterns.add('reducer');
        }

        if (key === 'middleware') {
          foundPatterns.add('middleware');
        }
      },

      ObjectMethod(path) {
        if (path.node.key?.name === 'mutation') {
          foundPatterns.add('mutation');
        }
      }
    });

    // match required patterns
    for (const pattern of patternsRequired) {
      if (foundPatterns.has(pattern) || content.includes(pattern)) {
        patternsFound.push(pattern);
      } else {
        patternsMissing.push(pattern);
      }
    }

  } catch (error) {
    // fallback: string matching
    for (const pattern of patternsRequired) {
      if (content.includes(pattern)) {
        patternsFound.push(pattern);
      } else {
        patternsMissing.push(pattern);
      }
    }
  }

  return { patternsFound, patternsMissing };
}
