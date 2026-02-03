# Challenge 02: Server and Client Components

**This is challenge 02 of 17.** Complete challenges in order. Work on this challenge only; after you finish and run review, move on to challenge 03.

**Prerequisites:** Challenge 01 (App Router, pages, layout, Link) should be done. You should have `app/layout.tsx`, `app/page.tsx`, and `app/about/page.tsx`.

## Goal

Understand when to use **Server Components** vs **Client Components** in the App Router. Create one **Client Component** (e.g. an interactive counter or theme toggle) that uses `'use client'` and use it from a Server Component page.

**In practice:** Server Components run only on the server and don't send component JS to the client, which keeps bundles smaller. Use Client Components only where you need hooks, event handlers, or browser APIs.

## What to do

1. **Client component** — Create a new component file, e.g. `app/components/Counter.tsx` (or `app/components/InteractiveWidget.tsx`). Put `'use client'` at the very top of the file. Inside the component, use React state (e.g. `useState`) and/or event handlers (e.g. `onClick`). The tests look for a file that has both `'use client'` and at least one of: `useState`, `onClick`, `onChange`, `onSubmit`.

2. **Wire into a page** — Import and render your Client Component from a Server Component page (e.g. `app/page.tsx`). Keep that page as a Server Component (do not add `'use client'` to the page file).

3. **Code** — TypeScript, no `console.*`, pass ESLint.

## What the review checks

| Step | What it does |
|------|----------------|
| **Functional tests** | At least one file has 'use client'; Client Component uses state or handlers; Server page exists without 'use client'. |
| **Code quality** | ESLint. |
| **Architecture** | 'use client' only where needed; Server/Client boundary clear. |
| **E2E** | Page loads; client interactivity works (e.g. button click). |

Pass threshold: weighted score ≥ 80%.

## Technical Requirements

- Have at least one **Client Component** file with `'use client'` at the top.
- Client Component must use `useState` and/or event handlers (e.g. onClick).
- Have at least one **Server Component** page (no 'use client') that renders the Client Component.
- TypeScript; pass ESLint; no console statements.

## Verify and submit

- `npm run dev` → open `/`, confirm your Client Component (e.g. counter or button) is interactive.
- From the project folder: `npm run review -- --challenge=02-server-and-client-components`
- Pass threshold: weighted score ≥ 80%. Then move to challenge 03.
