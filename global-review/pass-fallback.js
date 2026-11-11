/**
 * Shared Pass Fallback
 *
 * Functional tests are the main check. When they all pass but the learner is still under
 * minScore because ONE of E2E/architecture failed together with the AI review, those checks
 * are dropped from the weighting (and the score is raised to minScore if still short).
 * If E2E and architecture BOTH fail, no fallback: the code is likely genuinely missing something.
 * Used by all course review engines to avoid duplication.
 */

/**
 * Apply the fallback to a challenge result in place
 * @param {Object} result - Challenge result with scores, testResults, e2eResults, architectureResults, aiReviewResults
 * @param {Object} config - Course configuration from course-config.json
 * @returns {boolean} true if the fallback was applied
 */
export function applyPassFallback(result, config) {
  const minScore = config.requirements.minScore;
  if (result.totalScore >= minScore) return false;

  const scores = result.scores;
  const tests = result.testResults || {};
  const functionalPassed = tests.passed === true && tests.totalTests > 0 && scores.functionalTests === 100;

  const e2eFailed = result.e2eResults?.passed !== true;
  const architectureFailed = result.architectureResults?.passed !== true;

  const ai = result.aiReviewResults || {};
  const aiFailed = ai.skipped === true || Boolean(ai.error) || (scores.aiReview || 0) < minScore;

  // Exactly one of E2E/architecture failed, alongside the AI review
  if (!functionalPassed || !aiFailed || e2eFailed === architectureFailed) return false;

  // Same weights and defaults as the engines' total score
  const weights = {
    functionalTests: config.scoring.functionalTests,
    codeQuality: config.scoring.codeQuality,
    architecture: config.scoring.architecture,
    bestPractices: config.scoring.bestPractices,
    e2eTests: config.scoring.e2eTests || 0.15,
    aiReview: config.scoring.aiReview || 0.05
  };

  const excluded = ['aiReview', e2eFailed ? 'e2eTests' : 'architecture'];
  const kept = Object.keys(weights).filter(key => !excluded.includes(key));

  const reweightedScore =
    kept.reduce((sum, key) => sum + (scores[key] || 0) * weights[key], 0) /
    kept.reduce((sum, key) => sum + weights[key], 0);

  const raisedToMinimum = reweightedScore < minScore;
  const originalScore = result.totalScore;

  result.totalScore = raisedToMinimum ? minScore : reweightedScore;
  result.passed = true;
  result.fallback = {
    applied: true,
    reason: `All functional tests passed; ${e2eFailed ? 'E2E' : 'architecture'} and AI review were excluded from the score`,
    excluded,
    originalScore,
    reweightedScore,
    raisedToMinimum
  };

  return true;
}
