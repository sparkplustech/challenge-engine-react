# Challenge 16: RTK Query with Next.js

**This is challenge 16 of 17.** Complete challenges in order. Work on this challenge only; after you finish and run review, move on to challenge 17.

**Prerequisites:** Challenge 15 (Redux Toolkit with Next.js). You should have `app/store/store.ts` and `app/providers/StoreProvider.tsx`. You will need RTK Query (included in `@reduxjs/toolkit`).

## Goal

Use **RTK Query** in your Next.js App Router app: create an API slice with `createApi` and `fetchBaseQuery`, inject it into the Redux store, and use the generated hooks (e.g. `useGetPostsQuery`) in Client Components. The tests expect `app/store/apiSlice.ts`, API reducer and middleware in `app/store/store.ts`, and use of the generated query hook in a Client Component.

**In practice:** Add the API reducer and middleware to the same store used in Challenge 15. Use the query/mutation hooks only in Client Components.

## What to do

1. **API slice** — Create `app/store/apiSlice.ts` with `createApi` and `fetchBaseQuery` from `@reduxjs/toolkit/query`. Define at least one endpoint (e.g. `getPosts: query(...)` that fetches from `/api/posts` or an external API). Export the API and the generated hooks (e.g. `useGetPostsQuery`).
2. **Store** — In `app/store/store.ts`, add the API reducer and middleware: `reducer: { [api.reducerPath]: api.reducer, ... }`, `middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware)`.
3. **Use in Client Component** — In a Client Component (e.g. `app/posts/PostsList.tsx` or a component on the posts page), use the generated hook (e.g. `useGetPostsQuery()`) to fetch and display data. Handle loading and error states.
4. **Optional: mutation** — Add a mutation endpoint (e.g. `addPost`) and use it in a Client Component.
5. **Code** — TypeScript, no `console.*`, pass ESLint.

## Technical Requirements

- Use `createApi` and `fetchBaseQuery` from `@reduxjs/toolkit/query`.
- Add the API reducer and middleware to `app/store/store.ts`.
- Use at least one generated query hook in a Client Component.
- TypeScript; pass ESLint; no console statements.

## Verify and submit

- `npm run dev` → confirm RTK Query fetches and displays data (e.g. on posts page).
- From the project folder: `npm run review -- --challenge=16-rtk-query-with-nextjs`
- Pass threshold: weighted score ≥ 80%. Then move to challenge 17.
