# Challenge 09: Server Actions and Revalidation

**This is challenge 09 of 17.** Complete challenges in order. Work on this challenge only; after you finish and run review, move on to challenge 10.

**Prerequisites:** Challenges 01–08. You should have layout, pages, posts, API route, loading, dynamic route, and SSR.

## Goal

Use **Server Actions** to mutate data (e.g. form submit) and **revalidate** the Next.js cache with `revalidatePath` or `revalidateTag`. The tests look for `'use server'` and `revalidatePath` or `revalidateTag` in `app/actions.ts` (or `app/actions.js`).

## What to do

1. **Server Action** — Create `app/actions.ts`. Put `'use server'` at the very top of the file. Export at least one async function that accepts form data or params and performs a mutation (e.g. add a post). After the mutation, call `revalidatePath('/posts')` or `revalidateTag(tag)`. Import `revalidatePath` and/or `revalidateTag` from `next/cache`.
2. **Form or button** — In a Client Component (e.g. a form on the posts page or `app/components/AddPostForm.tsx`), call the Server Action (e.g. form `action={submitAction}` or `onClick` that invokes the action). Show success/error feedback.
3. **Code** — TypeScript, no `console.*`, pass ESLint.

## Technical Requirements

- Have `app/actions.ts` (or `app/actions.js`) with `'use server'` at the top and at least one async Server Action function.
- Call `revalidatePath(...)` or `revalidateTag(...)` from `next/cache` inside the Server Action after mutation.
- Invoke the Server Action from a Client Component (form action or event handler).
- TypeScript; pass ESLint; no console statements.

## Verify and submit

- `npm run dev` → submit the form or click the button; confirm mutation and that the list updates (or shows feedback).
- From the project folder: `npm run review -- --challenge=09-server-actions-and-revalidation`
- Pass threshold: weighted score ≥ 80%. Then move to challenge 10.
