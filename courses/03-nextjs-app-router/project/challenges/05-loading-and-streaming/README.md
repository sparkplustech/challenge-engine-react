# Challenge 05: Loading and Streaming

**This is challenge 05 of 17.** Complete challenges in order. Work on this challenge only; after you finish and run review, move on to challenge 06.

**Prerequisites:** Challenges 01–04. You should have `app/posts/page.tsx` and `app/api/posts/route.ts`.

## Goal

Use **loading UI** in the App Router: add `loading.tsx` for a route segment (and optionally `<Suspense>` with a fallback). The tests expect `app/posts/loading.tsx`.

## What to do

1. **loading.tsx** — Create `app/posts/loading.tsx`. Export a default component that shows a loading state (e.g. skeleton, spinner, or "Loading..."). The tests look for this exact path and for a default export.
2. **Suspense (optional)** — In `app/posts/page.tsx`, wrap the async part in `<Suspense fallback={...}>`.
3. **Code** — TypeScript, no `console.*`, pass ESLint.

## Technical Requirements

- Have `app/posts/loading.tsx` (tests expect this path).
- Default export a component that renders a loading UI.
- TypeScript; pass ESLint; no console statements.

## Verify and submit

- `npm run dev` → open `/posts`; a loading state may appear briefly before data.
- From the project folder: `npm run review -- --challenge=05-loading-and-streaming`
- Pass threshold: weighted score ≥ 80%. Then move to challenge 06.
