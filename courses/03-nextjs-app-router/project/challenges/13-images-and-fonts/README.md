# Challenge 13: Images and Fonts

**This is challenge 13 of 17.** Complete challenges in order. Work on this challenge only; after you finish and run review, move on to challenge 14.

**Prerequisites:** Challenges 01–12. You should have layout, pages, metadata, etc.

## Goal

Use **next/image** and **next/font** in the App Router for optimized images and fonts. The tests look for `next/image` in `app/page.tsx` and `next/font` in `app/layout.tsx`.

## What to do

1. **next/image** — In `app/page.tsx` (or a component used by it), import `Image` from `next/image` and use it with `src`, `alt`, and dimensions (`width`/`height` or `fill`). You can use a placeholder image (e.g. from `https://placehold.co`) or an image in `public/`.
2. **next/font** — In `app/layout.tsx`, import a font from `next/font/google` (e.g. `Inter`) or `next/font/local`. Apply the font's `className` to `<body>` or a wrapper div.
3. **Code** — TypeScript, no `console.*`, pass ESLint.

## Technical Requirements

- Use `Image` from `next/image` in `app/page.tsx` with `src`, `alt`, and dimensions (or `fill`).
- Use at least one font from `next/font` in `app/layout.tsx` and apply it to the layout.
- TypeScript; pass ESLint; no console statements.

## Verify and submit

- `npm run dev` → confirm image and font render correctly.
- From the project folder: `npm run review -- --challenge=13-images-and-fonts`
- Pass threshold: weighted score ≥ 80%. Then move to challenge 14.
