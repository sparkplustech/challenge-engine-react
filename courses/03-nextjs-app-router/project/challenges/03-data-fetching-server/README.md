# Challenge 03: Data Fetching in Server Components

**This is challenge 03 of 17.** Complete challenges in order. Work on this challenge only; after you finish and run review, move on to challenge 04.

**Prerequisites:** Challenges 01 and 02. You should have layout, home, about, and a Client Component.

## Goal

Fetch data **on the server** in an async Server Component and display it on a page. Use native `fetch` with `await` inside the component.

**In practice:** In the App Router, Server Components can be async and fetch data directly. No need for useEffect or a separate API call from the client for initial data.

## What to do

1. **Create the posts page** — Create `app/posts/page.tsx`. The tests expect this exact path. Make the default export an **async** function component (e.g. `export default async function PostsPage()`).

2. **Fetch data** — Inside the component, use `await fetch(...)` to get data. You can fetch from a public API (e.g. `https://jsonplaceholder.typicode.com/posts`) or from your own API route; challenge 04 will have you create `app/api/posts/route.ts` if you prefer.

3. **Display** — Render the fetched data on the page (e.g. list of post titles or cards). Handle empty/error states (try/catch or conditional render).

4. **Code** — TypeScript (type the response/data), no `console.*`, pass ESLint.

## What the review checks

| Step | What it does |
|------|----------------|
| **Functional tests** | Page file is async; uses fetch or async data; displays data. |
| **Code quality** | ESLint. |
| **Architecture** | Async Server Component, fetch/await pattern. |
| **E2E** | Page loads and shows fetched content. |

Pass threshold: weighted score ≥ 80%.

## Technical Requirements

- Have a page (e.g. `app/posts/page.tsx`) that is an **async** Server Component.
- Use `await fetch(...)` or equivalent async data fetch inside the component.
- Display the fetched data on the page; handle loading/error if required by tests.
- TypeScript; pass ESLint; no console statements.

## Verify and submit

- `npm run dev` → open `/posts`, confirm data appears.
- From the project folder: `npm run review -- --challenge=03-data-fetching-server`
- Pass threshold: weighted score ≥ 80%. Then move to challenge 04.
