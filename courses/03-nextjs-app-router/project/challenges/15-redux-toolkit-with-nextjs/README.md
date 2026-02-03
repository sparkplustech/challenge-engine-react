# Challenge 15: Redux Toolkit with Next.js

**This is challenge 15 of 17.** Complete challenges in order. Work on this challenge only; after you finish and run review, move on to challenge 16.

**Prerequisites:** Challenges 01–14. You will need to add Redux Toolkit and React-Redux: `npm install @reduxjs/toolkit react-redux`.

## Goal

Use **Redux Toolkit** in your Next.js App Router app: create a store, wrap the app with a Client Component `Provider`, and use `useSelector`/`useDispatch` in Client Components. The tests expect `app/store/store.ts`, `app/providers/StoreProvider.tsx`, and `useSelector`/`useDispatch` in a Client Component (e.g. StoreProvider, `app/page.tsx`, or `app/components/Counter.tsx`).

**In practice:** Redux runs on the client. Create a Client Component `app/providers/StoreProvider.tsx` with `'use client'` that creates the store and wraps `children` with `<Provider store={store}>`. Use the store only in Client Components.

## What to do

1. **Store** — Create `app/store/store.ts`. Use `configureStore` from `@reduxjs/toolkit` with at least one slice (e.g. a simple counter or theme slice). Export `store`, `RootState`, and `AppDispatch`.
2. **Store Provider** — Create `app/providers/StoreProvider.tsx` with `'use client'` at the top. Inside, create the store (or use a singleton) and wrap `children` with `<Provider store={store}>` from `react-redux`. Export the component.
3. **Layout** — In `app/layout.tsx`, wrap `{children}` with your StoreProvider so the store is available to all Client Components.
4. **Use store** — In at least one Client Component (e.g. StoreProvider, a Counter component, or `app/page.tsx` if you add `'use client'` and hooks there), use `useSelector` and/or `useDispatch` to read and update state.
5. **Code** — TypeScript, no `console.*`, pass ESLint.

## Technical Requirements

- Use `configureStore` from `@reduxjs/toolkit` and export `store`, `RootState`, `AppDispatch`.
- Have `app/providers/StoreProvider.tsx` that wraps children with `<Provider store={store}>` from `react-redux`.
- Use the StoreProvider in `app/layout.tsx`.
- Use `useSelector` and/or `useDispatch` in at least one Client Component.
- TypeScript; pass ESLint; no console statements.

## Verify and submit

- `npm run dev` → confirm Redux state and actions work (e.g. counter or theme).
- From the project folder: `npm run review -- --challenge=15-redux-toolkit-with-nextjs`
- Pass threshold: weighted score ≥ 80%. Then move to challenge 16.
