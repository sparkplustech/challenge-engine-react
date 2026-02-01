# Redux & RTK Query Project

This is a **real, runnable React application** where you complete 12 challenges in sequence: Redux store and slices, then RTK Query for API and caching, then using them together.

## Getting Started

1. **Install:** From repo root run `npm run setup`, or in this folder: `npm install`
2. **Run:** `npm run dev` — app at `http://localhost:5173`
3. **Challenges:** Complete **01–12 in order**. Each challenge has a README in `challenges/{id}/README.md`.

### Challenges (in order)

| # | Challenge | Path |
|---|-----------|------|
| 01 | Store Setup with configureStore | `challenges/01-store-setup/README.md` |
| 02 | First Slice with createSlice | `challenges/02-first-slice/README.md` |
| 03 | Reading and Dispatching | `challenges/03-reading-dispatching/README.md` |
| 04 | Multiple Slices | `challenges/04-multiple-slices/README.md` |
| 05 | Async Logic with createAsyncThunk | `challenges/05-async-thunks/README.md` |
| 06 | RTK Query Setup and API Slice | `challenges/06-rtk-query-setup/README.md` |
| 07 | Query Endpoints and useQuery Hooks | `challenges/07-queries/README.md` |
| 08 | Caching and Cache Tags | `challenges/08-caching-refetch/README.md` |
| 09 | Mutations with useMutation | `challenges/09-mutations/README.md` |
| 10 | Optimistic Updates | `challenges/10-optimistic-updates/README.md` |
| 11 | API and Local State Together | `challenges/11-api-local-state/README.md` |
| 12 | Error and Loading UX | `challenges/12-error-loading-ux/README.md` |

### Verify and score

```bash
npm run review                    # Review all challenges
npm run review -- --challenge=01-store-setup   # Review one challenge
```

## Progress Evidence

*Auto-updated when you run review.*

| Metric | Value |
|--------|-------|
| Challenges completed | 0 / 12 (0%) |
| Average score | 0% |

| Challenge | Skills covered | Status |
|-----------|----------------|--------|
| 01 Store Setup | Redux, configureStore, Provider | — |
| 02 First Slice | createSlice, reducers | — |
| 03 Reading and Dispatching | useSelector, useDispatch | — |
| 04 Multiple Slices | Multiple reducers | — |
| 05 Async Thunks | createAsyncThunk, extraReducers | — |
| 06 RTK Query Setup | createApi, fetchBaseQuery | — |
| 07 Queries | useGetUsersQuery, loading/error | — |
| 08 Caching | providesTags, invalidatesTags | — |
| 09 Mutations | useMutation, builder.mutation | — |
| 10 Optimistic Updates | onQueryStarted, rollback | — |
| 11 API + Local State | Slice + RTK Query together | — |
| 12 Error and Loading UX | refetch, ErrorDisplay | — |

## Project structure

- `src/store/` — Redux store, hooks, slices (you add slices in challenges)
- `src/api/` — Mock API and (from Ch06) RTK Query API slice
- `src/components/` — React components used by challenge routes
- `challenges/` — One folder per challenge with README and metadata
- `tests/` — Unit and E2E tests; run with `npm test` and `npm run test:e2e`

Results are written to `../results/` (challenge-results.json, course-summary.json, ai-feedback.json).

## 📊 Progress Evidence

*Auto-updated when you run review. Last run: 2/1/2026, 8:57:59 PM*

| Metric | Value |
|--------|-------|
| Challenges completed | 1 / 12 (8.3%) |
| Average score | 85% |

| Challenge | Skills covered | Status |
|-----------|----------------|--------|
| Store Setup with configureStore | Redux, Redux Toolkit, configureStore, Provider | Passed |
| First Slice with createSlice | Redux Toolkit, createSlice, reducers, actions | — |
| Reading and Dispatching in Components | React-Redux, useSelector, useDispatch, typed hooks | — |
| Multiple Slices in the Store | Redux, multiple reducers, slice per domain | — |
| Async Logic with createAsyncThunk | Redux Toolkit, createAsyncThunk, extraReducers, pending/fulfilled/rejected | — |
| RTK Query Setup and API Slice | RTK Query, createApi, fetchBaseQuery, API reducer and middleware | — |
| Query Endpoints and useQuery Hooks | RTK Query, useGetUsersQuery, loading, error, data | — |
| Caching and Cache Tags | RTK Query, providesTags, invalidatesTags, cache invalidation | — |
| Mutations with useMutation | RTK Query, builder.mutation, useMutation, POST/PUT/DELETE | — |
| Optimistic Updates | RTK Query, optimistic updates, onQueryStarted, rollback | — |
| API and Local State Together | Redux, RTK Query, slice + API in one store, filtering/sorting | — |
| Error and Loading UX | RTK Query, loading state, error state, retry, UX | — |
