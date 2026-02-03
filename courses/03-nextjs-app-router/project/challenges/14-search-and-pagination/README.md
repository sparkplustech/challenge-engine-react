# Challenge 14: Search and Pagination

**This is challenge 14 of 17.** Complete challenges in order. Work on this challenge only; after you finish and run review, move on to challenge 15.

**Prerequisites:** Challenges 01–13. You should have posts page, images/fonts, etc.

## Goal

Add **search** and **pagination** in the App Router: use `searchParams` in a page to read query params (e.g. `?q=...&page=1`) and render filtered/paginated content. The tests expect `app/posts/page.tsx` to receive and use `searchParams`.

## What to do

1. **searchParams** — In `app/posts/page.tsx`, receive `searchParams` as a prop (e.g. `{ searchParams }: { searchParams: { q?: string; page?: string } }`). Read `q` for search and `page` for pagination.
2. **Search** — Use the search param to filter data (e.g. filter posts by title). Display the filtered list.
3. **Pagination** — Use the page param to slice data (e.g. show 10 items per page). Add links or buttons to navigate to `?page=2`, etc., using `Link` with `href="/posts?page=2"` or string concatenation.
4. **Code** — TypeScript, no `console.*`, pass ESLint.

## Technical Requirements

- Have `app/posts/page.tsx` that receives `searchParams` and uses it (e.g. `q` for search, `page` for pagination).
- Display filtered and/or paginated content.
- TypeScript; pass ESLint; no console statements.

## Verify and submit

- `npm run dev` → open `/posts?page=1` and `/posts?q=test`; confirm filtering/pagination.
- From the project folder: `npm run review -- --challenge=14-search-and-pagination`
- Pass threshold: weighted score ≥ 80%. Then move to challenge 15.
