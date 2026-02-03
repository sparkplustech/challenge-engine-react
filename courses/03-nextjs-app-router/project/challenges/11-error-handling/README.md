# Challenge 11: Error Handling

**This is challenge 11 of 17.** Complete challenges in order. Work on this challenge only; after you finish and run review, move on to challenge 12.

**Prerequisites:** Challenges 01–10. You should have dynamic route `app/posts/[id]/page.tsx`.

## Goal

Handle **errors** in the App Router: add `error.tsx` for a route segment and use `notFound()` for 404s. The tests expect `app/error.tsx` or `app/posts/error.tsx`, and `notFound()` used in `app/posts/[id]/page.tsx` (e.g. when the post is missing).

## What to do

1. **error.tsx** — Create `app/error.tsx` or `app/posts/error.tsx`. Export a default Client Component that receives `error` and `reset` props. Display an error message and optionally a "Try again" button that calls `reset()`.
2. **notFound()** — In `app/posts/[id]/page.tsx`, import `notFound` from `next/navigation` and when the fetched post is missing (e.g. null or undefined), call `notFound()` so Next.js renders the nearest `not-found.tsx`. The tests require both the import and a call to `notFound()` in that file.
3. **not-found.tsx (optional)** — Create `app/not-found.tsx` to customize the 404 page.
4. **Code** — TypeScript, no `console.*`, pass ESLint.

## Technical Requirements

- Have at least one `error.tsx` file (e.g. `app/error.tsx` or `app/posts/error.tsx`).
- Use `notFound()` from `next/navigation` in `app/posts/[id]/page.tsx` when the resource is missing.
- TypeScript; pass ESLint; no console statements.

## Verify and submit

- `npm run dev` → open `/posts/99999` (invalid ID); confirm 404 or error UI.
- From the project folder: `npm run review -- --challenge=11-error-handling`
- Pass threshold: weighted score ≥ 80%. Then move to challenge 12.
