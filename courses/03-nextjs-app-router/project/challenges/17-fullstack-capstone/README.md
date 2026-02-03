# Challenge 17: Fullstack Capstone

**This is challenge 17 of 17.** The final challenge. Complete challenges 01–16 first.

**Prerequisites:** Challenges 01–16. You should have layout, pages, posts, dynamic route, error handling, metadata, Redux, RTK Query, etc.

## Goal

Combine multiple Next.js concepts into one **fullstack feature**: ensure your dynamic post page (`app/posts/[id]/page.tsx`) fetches data, uses a Client Component for interaction (e.g. form or button), handles errors with `error.tsx` or `notFound()`, and sets metadata. The tests expect `app/posts/[id]/page.tsx`, `app/error.tsx` or `app/posts/error.tsx` or `app/not-found.tsx`, and `metadata` or `generateMetadata` on the dynamic page.

**In practice:** You have already built most of this across challenges 06, 11, and 12. Here you ensure the post detail page has: data fetch by `params.id`, a Client Component (e.g. edit form or like button), `notFound()` when the post is missing, and `generateMetadata({ params })` for title/description.

## What to do

1. **Dynamic route** — Ensure `app/posts/[id]/page.tsx` fetches data based on `params.id`. If not found, call `notFound()`.
2. **Client Component** — Include a Client Component on that page (e.g. edit form, like button, or filter) that uses state or Server Action/API.
3. **Error handling** — Ensure you have `app/error.tsx` or `app/posts/error.tsx` (from challenge 11) and/or call `notFound()` when resource is missing.
4. **Metadata** — Export `metadata` or `generateMetadata` on `app/posts/[id]/page.tsx` (title, description) based on the post.
5. **Code** — TypeScript, no `console.*`, pass ESLint.

## Technical Requirements

- Have `app/posts/[id]/page.tsx` that fetches data and uses `params`.
- Include at least one Client Component on that page (form, button, or interactive widget).
- Use `notFound()` when resource is missing and/or have `error.tsx`.
- Export `metadata` or `generateMetadata` on `app/posts/[id]/page.tsx`.
- TypeScript; pass ESLint; no console statements.

## Verify and submit

- `npm run dev` → open `/posts/1`; confirm data, interactivity, and metadata in the tab.
- From the project folder: `npm run review -- --challenge=17-fullstack-capstone`
- Pass threshold: weighted score ≥ 80%. You have completed all 17 challenges.
