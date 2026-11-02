import { describe, it, expect, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { apiSlice } from '../src/api/apiSlice'
import { mockApi } from '../src/api/mockServer'
import filtersReducer from '../src/store/slices/filtersSlice'
import PostsWithFilters from '../src/components/PostsWithFilters'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe('Challenge 11: API and Local State Together', () => {
  const projectDir = join(__dirname, '..')

  it('filtersSlice exists and is in store', () => {
    const sliceFile = join(projectDir, 'src/store/slices/filtersSlice.ts')
    expect(existsSync(sliceFile)).toBe(true)
    const storeFile = join(projectDir, 'src/store/store.ts')
    const storeContent = readFileSync(storeFile, 'utf-8')
    expect(storeContent).toMatch(/filters|filtersSlice|filtersReducer/)
  })

  it('PostsWithFilters uses useSelector and useGetPostsQuery or query hook', () => {
    const viewFile = join(projectDir, 'src/components/PostsWithFilters.tsx')
    expect(existsSync(viewFile)).toBe(true)
    const content = readFileSync(viewFile, 'utf-8')
    expect(content).toMatch(/useAppSelector|useSelector/)
    expect(content).toMatch(/useGetPostsQuery|useQuery|getPosts/)
  })

  it('PostsWithFilters has posts-with-filters and filter-controls data-testids', () => {
    const viewFile = join(projectDir, 'src/components/PostsWithFilters.tsx')
    const content = readFileSync(viewFile, 'utf-8')
    expect(content).toContain('posts-with-filters')
    expect(content).toContain('filter-controls')
  })

  it('filters posts by user and sorts the displayed results', async () => {
    const user = userEvent.setup()
    vi.spyOn(mockApi, 'getPosts').mockResolvedValueOnce([
      { id: 1, userId: 1, title: 'First post', body: 'Oldest' },
      { id: 3, userId: 2, title: 'Other user post', body: 'Not selected' },
      { id: 2, userId: 1, title: 'Second post', body: 'Newest for user one' },
    ])
    const store = configureStore({
      reducer: {
        filters: filtersReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    })

    const { unmount } = render(
      <Provider store={store}>
        <PostsWithFilters />
      </Provider>,
    )

    const postList = await screen.findByRole('list')
    const getTitles = () => within(postList).getAllByRole('heading').map((heading) => heading.textContent)
    expect(getTitles()).toEqual(['Other user post', 'Second post', 'First post'])

    await act(async () => {
      await user.selectOptions(screen.getByLabelText('Filter by user'), '1')
    })
    expect(getTitles()).toEqual(['Second post', 'First post'])

    await act(async () => {
      await user.selectOptions(screen.getByLabelText('Sort posts'), 'oldest')
    })
    expect(getTitles()).toEqual(['First post', 'Second post'])

    unmount()
    store.dispatch(apiSlice.util.resetApiState())
    vi.restoreAllMocks()
  })
})
