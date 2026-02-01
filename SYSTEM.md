# Challenge Engine - System Documentation

**Complete technical documentation for developers working on the automation system, review engines, and infrastructure.**

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Repository Structure](#repository-structure)
3. [Automation Flow](#automation-flow)
4. [Review Engine Architecture](#review-engine-architecture)
5. [Scoring System](#scoring-system)
6. [Scripts Reference](#scripts-reference)
7. [Dashboard System](#dashboard-system)
8. [Configuration Files](#configuration-files)
9. [Data Flow](#data-flow)
10. [Extending the System](#extending-the-system)
11. [Code Quality & Patterns](#code-quality--patterns)

---

## System Overview

The Challenge Engine is a **production-ready automated skill assessment system** that evaluates learner code through multiple layers of analysis. It supports:

- **Multiple courses** (currently 3: React Fundamentals, RTK Query, Next.js App Router)
- **Multiple challenges per course** (currently 3 per course, scalable to 100+)
- **6-layer evaluation system** (Functional Tests, Code Quality, Architecture, Best Practices, E2E Tests, AI Review)
- **Automated progress tracking** with README evidence updates
- **Dashboard UI** for viewing progress and running reviews
- **Pathway-level aggregation** across all courses

### Key Principles

1. **Deterministic Review**: All scoring is automated and reproducible
2. **No Hidden Requirements**: Everything evaluated is explicitly listed in challenge READMEs
3. **Real Applications**: Learners work in actual runnable projects, not isolated puzzles
4. **Evidence-Based**: All results are stored in JSON files and README evidence sections
5. **Scalable**: Designed to handle 50+ courses and 100+ challenges per course

---

## Repository Structure

```
Challenge-Engine/
├── courses/                          # Course definitions
│   ├── 01-react-fundamentals/
│   │   ├── project/                 # Runnable app (learner workspace)
│   │   │   ├── src/                 # Learner code goes here
│   │   │   ├── challenges/         # Challenge definitions
│   │   │   │   ├── 01-static-task-display/
│   │   │   │   │   ├── README.md   # Instructions + Technical Requirements
│   │   │   │   │   └── metadata.json # Challenge config
│   │   │   └── tests/               # Test files (don't edit)
│   │   ├── review-engine/          # Course-specific review engine
│   │   │   ├── index.js            # Main review orchestrator
│   │   │   ├── test-runner.js      # Runs unit tests (Vitest)
│   │   │   ├── e2e-runner.js       # Runs E2E tests (Playwright)
│   │   │   ├── linter.js           # ESLint checks
│   │   │   ├── architecture-checker.js  # AST pattern validation
│   │   │   └── best-practices.js    # Code standards checks
│   │   ├── ai-review/              # AI review module
│   │   │   └── index.js            # Groq API integration
│   │   ├── course-config.json      # Course configuration
│   │   └── results/                 # Auto-generated results
│   │       ├── challenge-results.json
│   │       ├── course-summary.json
│   │       └── ai-feedback.json
│   ├── 02-redux-rtk-query/          # Same structure
│   └── 03-nextjs-app-router/       # Same structure
│
├── global-review/                   # Pathway-level aggregation
│   ├── run-all-reviews.js          # Orchestrates all course reviews
│   ├── course-summary-generator.js # Shared course summary generator
│   ├── scoring-engine/             # Pathway scoring logic
│   │   └── index.js
│   └── ai-review/                  # Pathway AI aggregation
│       └── index.js
│
├── pathway-review/                  # Pathway configuration & results
│   ├── pathway-config.json         # Course weights, badge levels
│   ├── pathway-summary.json        # Auto-generated pathway summary
│   └── skill-breakdown.json        # Skill analysis
│
├── scripts/                         # Utility scripts
│   ├── setup.js                    # One-time setup (all deps)
│   ├── update-progress.js          # Aggregates progress.json
│   ├── update-readme-evidence.js   # Updates README evidence sections
│   ├── run-review-changed.js      # Smart review (git diff)
│   ├── run-review-course.js        # Review one course
│   ├── run-review-challenge.js     # Review one challenge
│   ├── get-changed-challenges.js   # Git diff → challenges
│   ├── health-check.js             # System validation
│   ├── ci-validate.js              # CI/CD validation
│   └── validate-structure.js       # Repo structure check
│
├── dashboard/                       # Dashboard UI + API
│   ├── app/                        # React UI (Vite)
│   │   ├── src/
│   │   └── package.json
│   ├── server.js                   # Express API server
│   └── package.json
│
├── learner-results/                 # Global progress tracking
│   └── progress.json                # Aggregated progress (all courses)
│
├── .github/workflows/               # GitHub Actions
│   └── solo-skill-review.yml       # Auto-review on push
│
└── README.md                        # User-facing documentation
```

---

## Automation Flow

### 1. Review Execution Flow

```
User runs review
    ↓
Review Engine (course-specific)
    ├── Functional Tests (35%) → Vitest
    ├── Code Quality (15%) → ESLint
    ├── Architecture (10%) → AST parsing
    ├── Best Practices (10%) → Heuristics
    ├── E2E Tests (15%) → Playwright
    └── AI Review (15%) → Groq API
    ↓
Calculate weighted score
    ↓
Write challenge-results.json
    ↓
Generate course-summary.json
    ↓
Update progress.json (via update-progress.js)
    ↓
Update README evidence (via update-readme-evidence.js)
```

### 2. Pathway Review Flow

```
User runs global review (npm run review:all)
    ↓
global-review/run-all-reviews.js
    ├── For each course:
    │   ├── Run course review engine
    │   ├── Load course-summary.json
    │   └── Aggregate results
    ├── Aggregate AI feedback
    ├── Calculate pathway score (weighted average)
    ├── Generate pathway-summary.json
    └── Update README evidence (all courses + root)
```

### 3. Smart Review (Changed Files Only)

```
User runs npm run review:changed
    ↓
scripts/get-changed-challenges.js
    ├── Git diff (vs origin/main or HEAD)
    ├── Map files → challenges (file-to-challenge-map.js)
    └── Output: list of affected challenges
    ↓
scripts/run-review-changed.js
    ├── For each changed challenge:
    │   └── Run review for that challenge only
    └── Update progress & evidence
```

### 4. GitHub Actions Automation

```
Push to repository
    ↓
.github/workflows/solo-skill-review.yml
    ├── Checkout code
    ├── Install dependencies (npm run setup)
    ├── Run global review (npm run review:all)
    ├── Commit updated results files
    └── Push results back to repo
```

---

## Review Engine Architecture

### Course Review Engine (`courses/{course}/review-engine/index.js`)

Each course has its own review engine that:

1. **Loads configuration** from `course-config.json`
2. **Determines challenges to review** (all or specific via `--challenge=ID`)
3. **For each challenge:**
   - Runs 6 evaluation layers
   - Calculates weighted score
   - Collects detailed feedback
4. **Generates course summary** (average score, completion %, badge level)
5. **Writes results** to `results/` directory
6. **Updates progress** via `update-progress.js`
7. **Updates README evidence** via `update-readme-evidence.js`

### Evaluation Layers

#### 1. Functional Tests (35% weight)
- **Runner**: `test-runner.js`
- **Framework**: Vitest
- **Location**: `project/tests/challenge-*.test.tsx`
- **Output**: Pass/fail count, test names, error messages
- **Score**: `(passed / total) * 100`

#### 2. Code Quality (15% weight)
- **Runner**: `linter.js`
- **Tool**: ESLint
- **Config**: `project/.eslintrc.json`
- **Output**: Error count, warning count, file:line details
- **Score**: `100 - (errors * 10 + warnings * 2)`, clamped to 0-100

#### 3. Architecture (10% weight)
- **Runner**: `architecture-checker.js`
- **Method**: AST parsing (using `@babel/parser`, `@babel/traverse`)
- **Checks**: Required patterns (e.g., "must use useState", "must export component")
- **Output**: Found patterns, missing patterns
- **Score**: `(found / required) * 100`

#### 4. Best Practices (10% weight)
- **Runner**: `best-practices.js`
- **Method**: Heuristic checks (file structure, naming, imports)
- **Output**: Issues found, recommendations
- **Score**: `100 - (issues * 10)`, clamped to 0-100

#### 5. E2E Tests (15% weight)
- **Runner**: `e2e-runner.js`
- **Framework**: Playwright
- **Location**: `project/tests/e2e/challenge-*.spec.ts`
- **Output**: Pass/fail count, test names, screenshots
- **Score**: `(passed / total) * 100`

#### 6. AI Review (15% weight)
- **Runner**: `ai-review/index.js`
- **API**: Groq API (Llama models)
- **Input**: Challenge README + learner code
- **Output**: Strengths, improvements, readability score
- **Score**: `readabilityScore` (0-100) from AI response
- **Fallback**: If API key missing, score = 0, but other layers still run

### Score Calculation

```javascript
totalScore = (
  functionalTests * 0.35 +
  codeQuality * 0.15 +
  architecture * 0.10 +
  bestPractices * 0.10 +
  e2eTests * 0.15 +
  aiReview * 0.15
)
```

**Pass threshold**: 80% (configurable per course in `course-config.json`)

---

## Scoring System

### Course-Level Scoring

**File**: `courses/{course}/results/course-summary.json`

```json
{
  "courseId": "01-react-fundamentals",
  "courseName": "React Fundamentals",
  "averageScore": 75.5,
  "completionPercentage": 100,
  "totalChallenges": 3,
  "completedChallenges": 3,
  "badgeLevel": "gold",
  "challengeResults": [...],
  "skillStrengths": [...],
  "improvementAreas": [...]
}
```

**Calculation**:
- `averageScore`: Weighted average of all challenge scores
- `completionPercentage`: `(completedChallenges / totalChallenges) * 100`
- `badgeLevel`: Determined by score + completion thresholds

### Pathway-Level Scoring

**File**: `pathway-review/pathway-summary.json`

**Calculation**:
- `overallScore`: Weighted average across all courses (using course weights from `pathway-config.json`)
- `completionPercentage`: `(completedChallenges / totalChallenges) * 100` (across all courses)
- `badgeLevel`: Determined by pathway-level thresholds

**Course Weights** (from `pathway-config.json`):
- React Fundamentals: 0.33
- RTK Query: 0.33
- Next.js App Router: 0.34

### Badge Levels

**Course Badge** (from `course-config.json`):
- Gold: Score ≥ 90% AND Completion = 100%
- Silver: Score ≥ 75% AND Completion ≥ 75%
- Bronze: Score ≥ 60% AND Completion ≥ 50%
- None: Below thresholds

**Pathway Badge** (from `pathway-config.json`):
- Gold: Score ≥ 90% AND Completion = 100%
- Silver: Score ≥ 75% AND Completion ≥ 75%
- Bronze: Score ≥ 60% AND Completion ≥ 50%
- None: Below thresholds

---

## Scripts Reference

### Setup Scripts

#### `scripts/setup.js`
**Purpose**: One-time setup after cloning repository  
**What it does**:
1. Installs dashboard dependencies (`dashboard/app/`)
2. Installs all course project dependencies
3. Installs all review engine dependencies
4. Installs Playwright browsers for E2E tests

**Usage**: `npm run setup` (from repo root)

**Time**: 3-5 minutes

---

### Review Scripts

#### `scripts/run-review-changed.js`
**Purpose**: Review only challenges whose code changed (smart review)  
**What it does**:
1. Gets changed files via git diff
2. Maps files to challenges (`scripts/lib/file-to-challenge-map.js`)
3. Runs review for affected challenges only
4. Updates progress and README evidence

**Usage**: `npm run review:changed` (from repo root)  
**Options**: `--ref origin/main` (compare against branch)

**When to use**: Before/after pushing code, to review only what changed

---

#### `scripts/run-review-course.js`
**Purpose**: Review all challenges in one course  
**What it does**:
1. Calls course review engine (`courses/{course}/review-engine/index.js`)
2. Updates progress and README evidence

**Usage**: `npm run review:course -- --course=01-react-fundamentals`

---

#### `scripts/run-review-challenge.js`
**Purpose**: Review one specific challenge  
**What it does**:
1. Calls course review engine with `--challenge=ID`
2. Updates progress and README evidence

**Usage**: `npm run review:challenge -- --course=01-react-fundamentals --challenge=01-static-task-display`

---

#### `global-review/run-all-reviews.js`
**Purpose**: Review all courses and generate pathway summary  
**What it does**:
1. For each course in `pathway-config.json`:
   - Runs course review engine
   - Loads course summary
2. Aggregates AI feedback
3. Calculates pathway-level metrics
4. Generates `pathway-summary.json`
5. Updates README evidence (all courses + root)

**Usage**: `npm run review:all` (from repo root)

---

### Progress Scripts

#### `scripts/update-progress.js`
**Purpose**: Aggregate all course results into global progress  
**What it does**:
1. Reads all `course-summary.json` files
2. Aggregates pathway-level metrics
3. Writes `learner-results/progress.json`
4. Calls `update-readme-evidence.js` to update READMEs

**Usage**: `npm run progress:update` (from repo root)  
**When**: Automatically called by review engines, or manually to refresh progress

**Output**: `learner-results/progress.json`

---

#### `scripts/update-readme-evidence.js`
**Purpose**: Update README evidence sections (completion %, average score, pass/fail)  
**What it does**:
1. **For course READMEs**: Updates `courses/{course}/project/README.md` with:
   - Challenges completed (count and %)
   - Average score
   - Pass/fail per challenge
2. **For root README**: Updates `README.md` with:
   - Pathway challenges completed (count and %)
   - Overall score
   - Pass/fail per course

**Usage**: 
- `node scripts/update-readme-evidence.js` (all READMEs)
- `node scripts/update-readme-evidence.js --course=01-react-fundamentals` (one course)

**When**: Automatically called by review engines and `update-progress.js`

**Note**: No badge levels shown in README evidence (evidence only: completion %, score, pass/fail)

---

### Utility Scripts

#### `scripts/get-changed-challenges.js`
**Purpose**: List challenges affected by changed files (git diff)  
**Output**: JSON array of challenge IDs  
**Usage**: `node scripts/get-changed-challenges.js [--ref origin/main]`

---

#### `scripts/health-check.js`
**Purpose**: Comprehensive system health check  
**What it checks**:
- Repository structure
- Configuration files
- Dependencies installed
- Test files exist

**Usage**: `node scripts/health-check.js`

---

#### `scripts/ci-validate.js`
**Purpose**: CI/CD pipeline validation  
**Usage**: `node scripts/ci-validate.js`

---

#### `scripts/validate-structure.js`
**Purpose**: Validate repository structure  
**Usage**: `node scripts/validate-structure.js`

---

#### `scripts/test-ai-review.js`
**Purpose**: Test Groq API connection  
**Requires**: `GROQ_API_KEY` in `.env`  
**Usage**: `npm run test:ai-review`

---

#### `scripts/e2e-test.js`
**Purpose**: End-to-end test (dashboard + review)  
**Requires**: Dashboard running on port 7700  
**Usage**: `npm run e2e`

---

## Dashboard System

### Architecture

**Frontend**: React + Vite (in `dashboard/app/`)  
**Backend**: Express API server (in `dashboard/server.js`)  
**Port**: 7700 (default, configurable via `DASHBOARD_PORT`)

### API Endpoints

#### `GET /api/progress`
Returns full progress JSON from `learner-results/progress.json`

**Response**:
```json
{
  "lastUpdated": "2026-01-29T...",
  "pathway": {
    "name": "Modern React Engineer",
    "overallScore": 75.5,
    "completionPercentage": 66.7,
    "totalChallenges": 9,
    "completedChallenges": 6
  },
  "courses": { ... }
}
```

---

#### `GET /api/courses?page=1&limit=20`
Returns paginated courses list

**Query params**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response**:
```json
{
  "courses": [...],
  "total": 3,
  "page": 1,
  "limit": 20
}
```

---

#### `GET /api/courses/:courseId`
Returns course detail with challenges

**Response**:
```json
{
  "courseId": "01-react-fundamentals",
  "courseName": "React Fundamentals",
  "challenges": [...],
  "results": { ... }
}
```

---

#### `GET /api/courses/:courseId/challenges?page=1&limit=50`
Returns paginated challenges for a course

**Query params**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50, max: 100)

---

#### `GET /api/courses/:courseId/challenges/:challengeId`
Returns challenge detail with:
- Instructions (README.md content)
- Last results (from `challenge-results.json`)
- AI feedback (if available)

**Response**:
```json
{
  "challengeId": "01-static-task-display",
  "challengeName": "Static Task Display",
  "readme": "# Challenge 01...",
  "results": { ... },
  "aiFeedback": { ... }
}
```

---

#### `POST /api/review`
Runs review for a challenge

**Body**:
```json
{
  "courseId": "01-react-fundamentals",
  "challengeId": "01-static-task-display"
}
```

**Response**: Updated progress JSON

**Process**:
1. Calls course review engine with `--challenge=ID`
2. Waits for completion
3. Returns updated progress

---

### Building & Running

**Build UI** (one-time):
```bash
npm run dashboard:build
```

**Start server**:
```bash
npm run dashboard
```

**Dev mode** (UI only, from `dashboard/app`):
```bash
npm run dev
```
(API must be running separately: `npm run dashboard` from root)

---

## Configuration Files

### `pathway-review/pathway-config.json`

Pathway-level configuration:

```json
{
  "pathwayName": "Modern React Engineer",
  "pathwayVersion": "1.0.0",
  "courses": [
    {
      "id": "01-react-fundamentals",
      "name": "React Fundamentals",
      "weight": 0.33,
      "required": true
    }
  ],
  "badgeLevels": {
    "gold": { "minScore": 90, "minCompletion": 100 },
    "silver": { "minScore": 75, "minCompletion": 75 },
    "bronze": { "minScore": 60, "minCompletion": 50 }
  }
}
```

---

### `courses/{course}/course-config.json`

Course-level configuration:

```json
{
  "courseId": "01-react-fundamentals",
  "courseName": "React Fundamentals",
  "challenges": [
    {
      "id": "01-static-task-display",
      "name": "Static Task Display",
      "weight": 0.25
    }
  ],
  "scoring": {
    "functionalTests": 0.35,
    "codeQuality": 0.15,
    "architecture": 0.10,
    "bestPractices": 0.10,
    "e2eTests": 0.15,
    "aiReview": 0.15
  },
  "requirements": {
    "minScore": 60,
    "minCompletion": 100
  }
}
```

**Note**: Scoring weights must sum to 1.0

---

### `courses/{course}/project/challenges/{challenge}/metadata.json`

Challenge-level metadata:

```json
{
  "challengeId": "01-static-task-display",
  "challengeName": "Static Task Display",
  "difficulty": "beginner",
  "estimatedTime": "2 hours"
}
```

---

## Data Flow

### Review Execution → Results

```
Review Engine runs
    ↓
challenge-results.json (per challenge)
    ↓
course-summary.json (aggregated per course)
    ↓
progress.json (aggregated pathway-level)
    ↓
README evidence (human-readable in READMEs)
```

### File Locations

**Challenge results**: `courses/{course}/results/challenge-results.json`  
**Course summary**: `courses/{course}/results/course-summary.json`  
**AI feedback**: `courses/{course}/results/ai-feedback.json`  
**Pathway summary**: `pathway-review/pathway-summary.json`  
**Progress**: `learner-results/progress.json`

### README Evidence

**Course README**: `courses/{course}/project/README.md`  
- Section: `## 📊 Progress Evidence`
- Shows: Challenges completed %, average score, pass/fail per challenge

**Root README**: `README.md`  
- Section: `## 📈 Progress Summary`
- Shows: Pathway completion %, overall score, pass/fail per course

**Auto-updated**: When review runs, evidence is automatically updated

---

## Extending the System

### Pluggable: No Code Changes for Count

**All automation and scripts are driven by config.** You can add any number of courses and challenges without changing review-engine code, scripts, or dashboard.

- **Course list**: Read from `pathway-review/pathway-config.json`. Add a course there and create the course folder; setup, global review, dashboard, progress, and README evidence all pick it up.
- **Challenge list**: Read from each `courses/{course}/course-config.json`. Add a challenge there and create the challenge folder; the course review engine loops over `config.challenges`.
- **Smart review (review:changed)**: Uses `scripts/lib/file-to-challenge-map.js`, which builds the map from pathway config + `challenges/*/metadata.json` and `metadata.filesToCheck`. No script edit needed—ensure each challenge has `metadata.json` with `filesToCheck` (list of project-relative files) so changed files map to the right challenge.

**You only add:** config entries, course/challenge folders, tests, and READMEs. Review setup, scoring, progress, and dashboard work for any count of courses and challenges.

---

## Guidelines & Learnings (from React Fundamentals)

Use these when creating or auditing challenges in **any** course (React Fundamentals, RTK Query, Next.js, etc.) so behavior is consistent and learner-ready.

### 1. Learner-ready project: no solution code

- **Rule:** Whatever a challenge README says to **create**, **add**, or **implement** must **not** already be done in the project. The learner should read the README and do that work.
- **Stubs only:** Keep minimal stubs so the app **builds** and routes exist: e.g. components that `return null` or a minimal element with **required `id`s** so unit and E2E tests can find elements (e.g. `id="filter-bar"`, `id="task-detail-page"`). Export any types/interfaces the app or tests need (e.g. `Task` from TaskList).
- **Do not pre-implement later steps:** If Challenge A says "Create FilterBar" and Challenge B says "Add a search input to FilterBar", the stub FilterBar must not include the search input. Otherwise the learner has nothing to add in B.
- **Example:** FilterBar stub = `<div id="filter-bar" />` only. Learner creates FilterBar with All/Active/Completed in Ch06 and adds search input in Ch09. TaskDetailPage stub = `<div id="task-detail-page" />`; learner adds useParams, back button, content in Ch21.
- **Remove solution-only code:** e.g. delete `taskReducer.ts` when handing to learners; App uses `useState` until the learner implements useReducer in the reducer challenge. Keep an empty `reducers/` with `.gitkeep` if the README asks them to create a file there.
- **In-app challenge list:** If the project has a ChallengeList or similar, keep it minimal and **include all challenges** from course-config (e.g. 01–23) so learners can navigate to every challenge route.

### 2. README vs project audit

- Before shipping a course to learners, for **every** challenge README:
  - List each instruction: "Create X", "Add Y", "Implement Z".
  - Confirm that X/Y/Z is **not** already fully implemented in the project (stubs and wiring are OK; real logic/content must be left to the learner).
- Files that exist only so the app compiles (e.g. TaskCard, TaskList, TaskForm, TaskApp, ThemeContext, ErrorBoundary) should be **stubs**: minimal signature and return value, no solution logic. Learner fills in implementation per README.

### 3. Review engine: merge results by challenge

- **Requirement:** When the workflow runs, the dashboard runs a review, or a single-challenge CLI run executes, only the **reviewed** challenge(s) should be updated in `challenge-results.json`. Other challenges’ results must be preserved.
- **Implementation:** In each course `review-engine/index.js`:
  - Load existing `challenge-results.json` (array).
  - Run only the requested challenge(s) (from `--challenge=ID` or all if omitted).
  - Merge: keep existing entries for challenges **not** run; replace only entries for challenges that were run.
  - Sort merged array by course config challenge order (stable output).
  - Write merged results; regenerate `course-summary.json` from the full merged list. Merge `ai-feedback.json` the same way (keep non-run, replace run).
- This way workflow, dashboard, and CLI all update only the relevant challenges without overwriting others.

### 4. CI / GitHub Actions

- **Checkout:** Use `fetch-depth: 2` (or more) in the checkout step. With default `fetch-depth: 1`, `git diff HEAD~1 HEAD` has no parent commit and fails or is empty, so CI may run "run all reviews" on every push (slow and brittle).
- **Changed-files logic:** With `fetch-depth: 2`, the diff works and "review changed" runs instead of "run all", so only affected challenges are reviewed.
- **Workflow name:** Use the product name consistently (e.g. "SOLO Challenges: Review").

### 5. Package lock and npm ci

- Keep `package.json` and `package-lock.json` in sync for every course project (and review-engine). Run `npm install` in each and commit the lock file so CI `npm ci` succeeds. Out-of-sync lock files cause `EUSAGE` (missing deps like eslint-visitor-keys, acorn, etc.) in CI.

### 6. Course project README table

- `update-readme-evidence.js` should write a **challenges table** in each course project README: **Challenge | Skills covered | Status**.
- **Skills:** From each challenge’s `metadata.json` (`skills` array). Read course config for challenge list order; for each challenge, read `challenges/{id}/metadata.json` for skills.
- **Status:** From `challenge-results.json` (Passed / Not passed) or "—" if not yet run. List **all** challenges from course config so the table is complete. Table updates whenever review runs (via `update-progress.js` → `update-readme-evidence.js`).

### 7. Challenge READMEs: practical blurbs

- For challenges that teach a **key concept** (useState, useEffect, useMemo, Context, useReducer, Error boundaries, Router, useRef, etc.), add a short **"In practice"** block (3–4 lines) after **Goal**: when the concept is used and why it matters for production or code quality. Only for concepts that justify it; not every challenge needs one.

### 8. metadata.json and file-to-challenge map

- **metadata.json** per challenge must include:
  - `challengeId`, `challengeName`
  - `filesToCheck`: array of **project-relative** paths (e.g. `["src/components/TaskCard.tsx"]`) so `file-to-challenge-map.js` can map changed files to challenges for smart review.
  - `skills`: array of strings (for README table and dashboard).
  - `patternsRequired`: used by the architecture checker (e.g. `["functionalComponent", "useState", "useMemo"]`).
- If a challenge involves forms, include "Form handling" (or similar) in `skills` where appropriate.

### 9. Architecture checker

- Accept **equivalent patterns** so learners aren’t penalized for valid alternatives: e.g. `useReducer` satisfying a "useState" or state-update requirement, `useRef` when the challenge requires refs. Add these in `review-engine/architecture-checker.js` so pattern matching recognizes them.

### 10. E2E tests and Playwright

- **Port:** Use a dedicated port in CI (e.g. 5174) in Playwright config so it doesn’t clash with a dev server. E2E runner can retry with alternate ports (e.g. 5175–5180) on port-in-use.
- **Flakiness:** Avoid assertions that are flaky in CI (e.g. `toBeFocused()`). Prefer visibility and attribute checks (e.g. input visible, `type="text"`).
- **Browsers:** `postinstall` in the course project can install Chromium so learners and CI don’t need extra steps; document or support `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD` for CI when browsers are cached.

### 11. Progress and results for learner handoff

- When giving the repo to learners, reset so no challenge appears completed:
  - Set `challenge-results.json` to `[]` and `course-summary.json` to 0 completed / 0% for each course.
  - Run `update-progress.js` so `learner-results/progress.json` and README evidence show 0% and no completed challenges. Learners see a clean slate.

### 12. HTTP client and scope

- React Fundamentals uses **fetch** for the data-fetching challenge; **Axios** is not in scope. If you have a separate RTK/RTK Query (or API) course, keep Axios there if needed; don’t add it to React Fundamentals.

### 14. Dashboard: skills and metadata

- **Skills:** Serve `skills` from each challenge's `metadata.json` in the challenge-detail API (`/api/courses/:courseId/challenges/:challengeId`) so the dashboard can show skills on the detail page. Optionally omit from the list API to keep payloads small.
- **Robustness:** When reading metadata (e.g. `getChallengeMetadata` in dashboard server), use **try/catch** and resolve **ROOT** from `import.meta.url` / `__dirname` so it works from repo root, `dashboard/`, or different CWDs. Handle missing `metadata.json` or missing `skills` (default to `[]`).
- **Client fallback:** On the detail page, use `detail.skills ?? detail.metadata?.skills ?? []` so both flat and nested API shapes work.

### 15. README clarity for learners

- **Alternatives:** If a challenge accepts more than one approach (e.g. `useState` or `useReducer`), say so in the README so learners aren't confused when tests pass with either.
- **Props and routes:** When a challenge involves routing (e.g. task detail page), clarify whether the app should pass a prop like `linkToTaskDetail` from App into list/card components, or use a shared route base; tests and stubs should match.
- **Hooks and deps:** For challenges involving `useCallback`/`useEffect`, mention dependency arrays in Technical Requirements so learners know what the tests expect.
- **Accessibility:** If tests expect specific `id`s for messages (e.g. empty state), document the required `id` in the README so screen readers and tests align.

### Checklist for new courses/challenges

- [ ] Learner-ready: stubs only; nothing the README asks to create/add/implement is already done.
- [ ] README audit: every "Create X" / "Add Y" checked against project; no pre-implementation.
- [ ] Review engine merges results by challenge; sorted by config order.
- [ ] CI: fetch-depth ≥ 2; package-lock in sync for npm ci.
- [ ] README evidence: challenge table with Skills + Status; practical blurbs where useful.
- [ ] metadata.json: filesToCheck, skills, patternsRequired.
- [ ] Architecture checker: equivalent patterns (useReducer, useRef, etc.) accepted.
- [ ] E2E: stable assertions; port and retry strategy for CI.
- [ ] Handoff: results and progress reset to empty/0%.
- [ ] When adding challenges: update `course-config.json`, project README challenge list, and any in-app ChallengeList/nav so all challenge routes are reachable.

---

### Adding a New Course

1. **Create course directory**: `courses/{course-id}/`
2. **Create project**: `courses/{course-id}/project/` (runnable app)
3. **Create review engine**: `courses/{course-id}/review-engine/`
   - Copy from existing course (e.g., `01-react-fundamentals`)
   - Adapt test runners, linters, architecture checkers for your tech stack
4. **Create AI review**: `courses/{course-id}/ai-review/index.js`
5. **Create config**: `courses/{course-id}/course-config.json`
6. **Add to pathway**: Update `pathway-review/pathway-config.json` (add one entry to `courses` array)

No other code changes. Setup, health-check, ci-validate, global review, dashboard, and progress all read courses from pathway config.

---

### Adding a New Challenge

1. **Create challenge directory**: `courses/{course}/project/challenges/{challenge-id}/`
2. **Create README.md**: Instructions + Technical Requirements section
3. **Create metadata.json**: Include `challengeId`, `challengeName`, and `filesToCheck` (array of project-relative paths, e.g. `["src/components/MyComponent.tsx"]`) so smart review can map file changes to this challenge
4. **Add tests**: `project/tests/challenge-{id}.test.tsx` and `e2e/challenge-{id}.spec.ts`
5. **Update course config**: Add challenge to `courses/{course}/course-config.json` in the `challenges` array

No other code changes. The review engine iterates over `config.challenges`; file-to-challenge map is built from metadata.

---

### Modifying Scoring Weights

**Course-level**: Edit `courses/{course}/course-config.json` → `scoring` section  
**Pathway-level**: Edit `pathway-review/pathway-config.json` → `scoring` section (if used)

**Important**: Weights must sum to 1.0

---

### Adding a New Evaluation Layer

1. **Create runner**: `courses/{course}/review-engine/{layer-name}.js`
2. **Export function**: `export async function run{LayerName}(challengeId, projectDir)`
3. **Return score**: `{ score: 0-100, details: {...} }`
4. **Integrate**: Add to `review-engine/index.js`:
   - Import runner
   - Call in `reviewChallenge()`
   - Add to score calculation
   - Update `course-config.json` scoring weights

---

### Modifying Dashboard

**UI**: Edit `dashboard/app/src/App.tsx` and components  
**API**: Edit `dashboard/server.js`  
**Build**: `npm run dashboard:build` (from root)

---

## Code Quality & Patterns

### Code Style

- **ES modules**: All scripts use `import/export` (no CommonJS)
- **Async/await**: Prefer over promises
- **Error handling**: Try/catch with meaningful error messages
- **Console output**: Use emojis for visual clarity (✅ ❌ ⚠️ 📊 🔍)
- **File paths**: Use `join()` from `path` module (cross-platform)

### Common Patterns

#### Getting Repo Root
```javascript
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');
```

#### Reading JSON Config
```javascript
import { readFileSync, existsSync } from 'fs';
const configPath = join(ROOT_DIR, 'path', 'config.json');
if (!existsSync(configPath)) {
  throw new Error('Config not found');
}
const config = JSON.parse(readFileSync(configPath, 'utf-8'));
```

#### Running Child Processes
```javascript
import { execSync } from 'child_process';
execSync('node script.js', {
  cwd: WORKING_DIR,
  stdio: 'inherit'  // or 'pipe' for silent
});
```

### Redundancy to Avoid

1. **Don't duplicate scoring logic**: Use shared functions from `global-review/scoring-engine/`
2. **Don't duplicate course summary generation**: Use `generateCourseSummary` from `global-review/course-summary-generator.js`
3. **Don't hardcode paths**: Use `join()` and relative paths from config
4. **Don't skip error handling**: Always check file existence, handle API failures
5. **Don't mix concerns**: Keep review logic separate from progress updates

### Shared Modules

**`global-review/course-summary-generator.js`**: Shared function for generating course summaries. All course review engines import this to avoid duplication.

**`global-review/scoring-engine/index.js`**: Shared scoring utilities:
- `calculateWeightedAverage()`: Weighted average across courses
- `determineBadgeLevel()`: Badge level determination
- `aggregateStrengths()`: Aggregate skill strengths
- `aggregateImprovements()`: Aggregate improvement areas

### Testing

- **Unit tests**: Run in course projects (`npm test`)
- **E2E tests**: Run in course projects (`npm run test:e2e`)
- **System tests**: `npm run e2e` (dashboard + review integration)
- **Health checks**: `node scripts/health-check.js`

---

## Troubleshooting for Developers

### Review Engine Not Running

- Check: `course-config.json` exists and is valid JSON
- Check: Review engine dependencies installed (`cd review-engine && npm install`)
- Check: Project dependencies installed (`cd project && npm install`)

### Progress Not Updating

- Check: `update-progress.js` is being called (check console output)
- Check: `learner-results/` directory exists
- Check: Course summaries exist (`courses/{course}/results/course-summary.json`)

### README Evidence Not Updating

- Check: `update-readme-evidence.js` is being called
- Check: README files exist and are writable
- Check: Section markers exist (`## 📊 Progress Evidence` or `## 📈 Progress Summary`)

### Dashboard Not Starting

- Check: Dashboard dependencies installed (`cd dashboard/app && npm install`)
- Check: UI built (`npm run dashboard:build`)
- Check: Port 7700 not in use (or set `DASHBOARD_PORT`)

### AI Review Failing

- Check: `GROQ_API_KEY` set in `.env` file
- Check: API key valid (`npm run test:ai-review`)
- Check: Network connectivity

---

## Summary

This system is designed to be:
- **Modular**: Each course has its own review engine
- **Extensible**: Easy to add courses, challenges, evaluation layers
- **Automated**: Reviews run automatically, progress updates automatically
- **Evidence-based**: All results stored in JSON + README evidence
- **Scalable**: Handles 50+ courses, 100+ challenges per course

For questions or improvements, refer to this documentation and the codebase structure.

---

**Last Updated**: 2026-01-29  
**Version**: 1.0.0
