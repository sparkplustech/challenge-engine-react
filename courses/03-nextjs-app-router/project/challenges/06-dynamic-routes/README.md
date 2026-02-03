# Challenge 06: Dynamic Routes

**This is challenge 06 of 17.** Complete challenges in order. Work on this challenge only; after you finish and run review, move on to challenge 07.

**Prerequisites:** Challenges 01–05. You should have posts page and loading UI.

## Goal

Create **dynamic route segments** in the App Router: a segment that depends on a parameter (e.g. `[id]` or `[slug]`) and use it in the page. The tests expect `app/posts/[id]/page.tsx` (or `app/posts/[slug]/page.tsx` or `app/blog/[id]/page.tsx`).

## What to do

1. **Dynamic segment** — Create `app/posts/[id]/page.tsx`. The page component receives `params` as a prop (e.g. `params: { id: string }`). The tests look for a dynamic route folder and for use of `params` (e.g. `params.id`) in the file.
2. **Use params** — Read the dynamic param (e.g. `params.id`) and use it to fetch data or display content (e.g. single post by ID).
3. **Optional: generateStaticParams** — Export `generateStaticParams` that returns an array of `{ id: string }` for known IDs.
4. **Code** — TypeScript (type params), no `console.*`, pass ESLint.

## Technical Requirements

- Have a dynamic route: `app/posts/[id]/page.tsx` or `app/posts/[slug]/page.tsx` or `app/blog/[id]/page.tsx`.
- Page component receives `params` and uses the dynamic value (e.g. params.id).
- TypeScript; pass ESLint; no console statements.

## Verify and submit

- `npm run dev` → open `/posts/1` (or any ID), confirm content based on the param.
- From the project folder: `npm run review -- --challenge=06-dynamic-routes`
- Pass threshold: weighted score ≥ 80%. Then move to challenge 07.
