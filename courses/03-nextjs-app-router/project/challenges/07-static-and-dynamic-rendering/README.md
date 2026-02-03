# Challenge 07: Static and Dynamic Rendering

**This is challenge 07 of 17.** Complete challenges in order. Work on this challenge only; after you finish and run review, move on to challenge 08.

**Prerequisites:** Challenges 01–06. You should have layout, pages, posts, API route, loading, and dynamic route.

## Goal

Control **static vs dynamic rendering** in the App Router: use `export const dynamic = 'force-static'` or `'force-dynamic'` (or rely on dynamic APIs like `headers()`, `cookies()`, `searchParams`). The tests look for at least one page with `dynamic` export or dynamic APIs.

## What to do

1. **Static page** — In a page that can be statically generated (e.g. `app/page.tsx` or `app/about/page.tsx`), optionally set `export const dynamic = 'force-static'`.
2. **Dynamic page** — In a page that should be rendered on each request (e.g. `app/posts/page.tsx`), set `export const dynamic = 'force-dynamic'` or use `headers()`, `cookies()`, or `searchParams` in the component.
3. **Code** — TypeScript, no `console.*`, pass ESLint.

## Technical Requirements

- Have at least one page that explicitly sets `dynamic = 'force-static'` or `'force-dynamic'`, or uses dynamic APIs (headers, cookies, searchParams).
- TypeScript; pass ESLint; no console statements.

## Verify and submit

- `npm run build` → inspect output for static vs dynamic routes.
- From the project folder: `npm run review -- --challenge=07-static-and-dynamic-rendering`
- Pass threshold: weighted score ≥ 80%. Then move to challenge 08.
