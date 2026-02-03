# Challenge 12: Metadata and SEO

**This is challenge 12 of 17.** Complete challenges in order. Work on this challenge only; after you finish and run review, move on to challenge 13.

**Prerequisites:** Challenges 01–11. You should have layout, pages, posts, error handling, etc.

## Goal

Add **metadata** to your Next.js app: use `export const metadata` (or `generateMetadata`) on pages for title, description, and optionally Open Graph. The tests look for `metadata` or `generateMetadata` with `title` or `description` in `app/layout.tsx`, `app/page.tsx`, or `app/posts/page.tsx`.

## What to do

1. **Static metadata** — On at least one page (e.g. `app/layout.tsx`, `app/page.tsx`, or `app/posts/page.tsx`), export `metadata` with `title` and `description`, e.g. `export const metadata = { title: '...', description: '...' }`. Your layout may already have metadata; ensure at least one file has it.
2. **Dynamic metadata (optional)** — For `app/posts/[id]/page.tsx`, export `generateMetadata({ params })` that returns `{ title, description }` based on params.
3. **Open Graph (optional)** — Add `openGraph: { title, description }` to metadata for social sharing.
4. **Code** — TypeScript, no `console.*`, pass ESLint.

## Technical Requirements

- Have at least one page that exports `metadata` or `generateMetadata` with `title` and `description`.
- TypeScript; pass ESLint; no console statements.

## Verify and submit

- `npm run dev` → check the browser tab title and meta tags.
- From the project folder: `npm run review -- --challenge=12-metadata-and-seo`
- Pass threshold: weighted score ≥ 80%. Then move to challenge 13.
