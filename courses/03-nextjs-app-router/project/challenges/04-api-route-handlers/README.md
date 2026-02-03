# Challenge 04: API Route Handlers

**This is challenge 04 of 17.** Complete challenges in order. Work on this challenge only; after you finish and run review, move on to challenge 05.

**Prerequisites:** Challenges 01–03. You should have layout, pages, a Client Component, and `app/posts/page.tsx` (data fetching).

## Goal

Create **Route Handlers** in the App Router: implement `GET` (and optionally `POST`) in `app/api/.../route.ts` that return JSON. The tests expect `app/api/posts/route.ts`.

## What to do

1. **GET handler** — Create `app/api/posts/route.ts`. Export a `GET` function that returns JSON, e.g. `return Response.json([...])` or `NextResponse.json([...])`. The tests look for this exact path and for `Response.json` or `NextResponse.json`.
2. **POST handler (optional)** — In the same file, export a `POST` function that reads the request body and returns JSON.
3. **Types** — Use TypeScript for request/response shapes.
4. **Code** — No `console.*`, pass ESLint.

## Technical Requirements

- Have `app/api/posts/route.ts` (tests expect this path).
- Export `GET` that returns JSON (e.g. `Response.json(data)`).
- TypeScript; pass ESLint; no console statements.

## Verify and submit

- `npm run dev` → open `/api/posts` or visit it from your posts page; confirm JSON response.
- From the project folder: `npm run review -- --challenge=04-api-route-handlers`
- Pass threshold: weighted score ≥ 80%. Then move to challenge 05.
