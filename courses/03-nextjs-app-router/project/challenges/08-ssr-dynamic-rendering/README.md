# Challenge 08: SSR (Server-Side Rendering)

**This is challenge 08 of 17.** Complete challenges in order. Work on this challenge only; after you finish and run review, move on to challenge 09.

**Prerequisites:** Challenges 01–07. You should have static/dynamic rendering set up.

## Goal

Implement **Server-Side Rendering** in the App Router: a page that is rendered on **each request** on the server, with uncached or request-time data. The tests look for `export const dynamic = 'force-dynamic'` or `cache: 'no-store'` in `app/posts/page.tsx` or `app/dashboard/page.tsx`.

## What to do

1. **Dynamic page** — In a page (e.g. `app/posts/page.tsx` or `app/dashboard/page.tsx`), set `export const dynamic = 'force-dynamic'` at the top, or use `fetch(..., { cache: 'no-store' })` (or both).
2. **Request-time data** — Fetch data inside the page without caching (e.g. `fetch(url, { cache: 'no-store' })`) so each request gets fresh data.
3. **Display** — Render the fetched data on the page.
4. **Code** — TypeScript, no `console.*`, pass ESLint.

## Technical Requirements

- Have at least one page with `export const dynamic = 'force-dynamic'` or use `fetch(..., { cache: 'no-store' })`.
- Data is fetched on the server (in that page or a child Server Component).
- TypeScript; pass ESLint; no console statements.

## Verify and submit

- `npm run dev` → open the page; refresh and confirm data can change per request if applicable.
- From the project folder: `npm run review -- --challenge=08-ssr-dynamic-rendering`
- Pass threshold: weighted score ≥ 80%. Then move to challenge 09.
