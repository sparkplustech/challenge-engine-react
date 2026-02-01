import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Checks best practices based ONLY on what's specified in challenge requirements
 */
export async function checkBestPractices(challengeMetadata, projectDir) {
  const filesToCheck = challengeMetadata.filesToCheck || [];
  const requirements = challengeMetadata.requirements?.bestPractices || [];
  
  // If no best practices requirements specified, return 100% (nothing to check)
  if (requirements.length === 0) {
    return {
      score: 100,
      passed: true,
      issues: [],
      details: [],
      note: 'No best practices requirements specified in challenge'
    };
  }
  
  const results = {
    score: 0,
    passed: false,
    issues: [],
    details: []
  };

  let totalChecks = 0;
  let passedChecks = 0;

  for (const file of filesToCheck) {
    const filePath = join(projectDir, file);
    
    if (!existsSync(filePath)) {
      continue;
    }

    try {
      const fileContent = readFileSync(filePath, 'utf-8');
      const fileResults = checkFileBestPractices(fileContent, file, requirements);
      
      totalChecks += fileResults.totalChecks;
      passedChecks += fileResults.passedChecks;
      
      results.details.push({
        file,
        issues: fileResults.issues,
        score: fileResults.score
      });
    } catch (error) {
      results.issues.push({
        file,
        error: error.message
      });
    }
  }

  // Calculate score
  results.score = totalChecks > 0 
    ? Math.round((passedChecks / totalChecks) * 100 * 10) / 10
    : 100; // If no checks, assume passed
  
  results.passed = results.score >= 70;

  return results;
}

function checkFileBestPractices(content, fileName, requirements) {
  const issues = [];
  let totalChecks = 0;
  let passedChecks = 0;

  // Only check what's specified in requirements
  for (const requirement of requirements) {
    const reqLower = requirement.toLowerCase();
    
    // Check for console.log requirement
    if (reqLower.includes('console') || reqLower.includes('no console')) {
      totalChecks++;
      const consoleLogMatches = content.match(/console\.(log|error|warn|debug)/g);
      if (!consoleLogMatches || consoleLogMatches.length === 0) {
        passedChecks++;
      } else {
        issues.push({
          type: 'console-log',
          message: `Found ${consoleLogMatches.length} console statement(s) - requirement: ${requirement}`,
          severity: 'warning'
        });
      }
    }
    
    // Check for TypeScript requirement
    if (reqLower.includes('typescript') || reqLower.includes('type')) {
      totalChecks++;
      if (fileName.endsWith('.tsx') || fileName.endsWith('.ts')) {
        const hasTypeAnnotations = /:\s*\w+/.test(content) || /<[A-Z]\w+>/.test(content) || /interface\s+\w+/.test(content);
        if (hasTypeAnnotations) {
          passedChecks++;
        } else {
          issues.push({
            type: 'typescript',
            message: `Missing type annotations - requirement: ${requirement}`,
            severity: 'warning'
          });
        }
      } else {
        passedChecks++; // Not applicable for non-TS files
      }
    }
    
    // Check for functional component requirement
    if (reqLower.includes('functional component') || reqLower.includes('functional component pattern')) {
      totalChecks++;
      const hasFunctionalComponent = /export\s+(default\s+)?(function|const)\s+[A-Z]/.test(content) || 
                                      /const\s+[A-Z]\w+\s*=\s*\(/.test(content);
      if (hasFunctionalComponent) {
        passedChecks++;
      } else {
        issues.push({
          type: 'functional-component',
          message: `Must use functional component pattern - requirement: ${requirement}`,
          severity: 'error'
        });
      }
    }
    
    // Check for ESLint requirement
    if (reqLower.includes('eslint') || reqLower.includes('lint')) {
      // This is handled by the linter, so we skip here
      // Just mark as passed since linter will check it
      totalChecks++;
      passedChecks++;
    }
  }

  // If no specific requirements, return 100% (nothing to check)
  if (totalChecks === 0) {
    return {
      totalChecks: 0,
      passedChecks: 0,
      issues: [],
      score: 100
    };
  }

  const score = totalChecks > 0 
    ? Math.round((passedChecks / totalChecks) * 100 * 10) / 10
    : 100;

  return {
    totalChecks,
    passedChecks,
    issues,
    score
  };
}
