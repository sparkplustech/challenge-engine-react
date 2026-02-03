# Challenge 13: Query with Parameters and Detail View

## Goal

Add a **parameterized query** (e.g. `getPostById`) to your API slice and use it in a detail view. Use the generated hook with an argument (e.g. `useGetPostByIdQuery(postId)`) and optionally **skip** the query when the id is missing so you don't request with invalid data.

**In practice:** Many endpoints take parameters (e.g. `/posts/1`, `/users/42`). In RTK Query you define `builder.query<Post, number>({ query: (id) => ... })`; the generated hook accepts that argument: `useGetPostByIdQuery(id)`. Use `skip: !id` (or similar) so the query does not run when there is no id—e.g. on a detail route before the id is available.

---

## What to do

1. **API slice:** In `src/api/apiSlice.ts`, add a query endpoint `getPostById` that takes a post id (e.g. `builder.query<Post, number>({ queryFn: async (id) => ({ data: await mockApi.getPostById(id) }) })` or equivalent). Add `providesTags` for the single entity: `(result, error, id) => [{ type: 'Post', id }]` so cache invalidation can target this post.
2. **Detail component:** Create `src/components/PostDetail.tsx`. It should receive a post id (e.g. via props or `useParams()` from React Router). Use `useGetPostByIdQuery(id, { skip: !id })` (or your hook name) so the query runs only when `id` is defined. Render loading, error, or the post (title, body, etc.). Use `data-testid="post-detail"`, `data-testid="post-detail-loading"`, and `data-testid="post-detail-error"` where appropriate.
3. **App:** Render PostDetail on `/challenge/13-query-parameters`. You can pass a post id via route (e.g. `/challenge/13-query-parameters/:postId`) or a query param; or render PostDetail with a sample id (e.g. `1`) for the challenge route so the review can verify the hook is used.
4. **Code:** TypeScript, pass ESLint, no `console.*`.

---

## What the review checks

- API slice has getPostById query endpoint (query takes an argument).
- PostDetail uses the generated useGetPostByIdQuery hook with an id argument.
- skip option used when id may be missing (or equivalent).
- Loading and error states handled; post data displayed.
- Architecture: getPostById, useGetPostByIdQuery (or equivalent).

Pass threshold: weighted score ≥ 80%.

---

## Technical Requirements

- getPostById query endpoint in API slice (single argument: post id).
- PostDetail uses useGetPostByIdQuery(id, { skip: !id }) and handles loading, error, and data.
- Route /challenge/13-query-parameters renders PostDetail (with an id from route, query, or prop).
- TypeScript; pass ESLint; no console statements.

---

## Verify and submit

Run `npm run review -- --challenge=13-query-parameters` to get scored.
