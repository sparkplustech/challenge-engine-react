# Challenge 10: Caching and Revalidating

**This is challenge 10 of 17.** Complete challenges in order. Work on this challenge only; after you finish and run review, move on to challenge 11.

**Prerequisites:** Challenges 01–09. You should have Server Actions and revalidation in place.

## Goal

Use **caching** and **revalidation** in the App Router: configure `fetch` cache options (e.g. `next: { revalidate: 60 }`) and optionally use `revalidatePath` or `revalidateTag` for on-demand revalidation. The tests look for fetch cache options in `app/posts/page.tsx` or revalidate in `app/actions.ts`.

## What to do

1. **Cached fetch** — In a Server Component (e.g. `app/posts/page.tsx`), use `fetch(..., { next: { revalidate: 60 } })` (or `cache: 'force-cache'`) so data is cached and revalidated after a time.
2. **On-demand revalidation (optional)** — In your Server Action (`app/actions.ts`), you may already call `revalidatePath(path)` or `revalidateTag(tag)`; that satisfies the test if the cached-fetch check is not found.
3. **Code** — TypeScript, no `console.*`, pass ESLint.

## Technical Requirements

- Have at least one `fetch` call with cache options (e.g. `next: { revalidate: N }` or `cache: 'force-cache'`), or use `revalidatePath`/`revalidateTag` in `app/actions.ts`.
- TypeScript; pass ESLint; no console statements.

## Verify and submit

- From the project folder: `npm run review -- --challenge=10-caching-and-revalidating`
- Pass threshold: weighted score ≥ 80%. Then move to challenge 11.
