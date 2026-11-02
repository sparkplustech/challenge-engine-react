import { describe, it, expect, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { apiSlice } from '../src/api/apiSlice'
import { mockApi } from '../src/api/mockServer'
import PostsList from '../src/components/PostsList'
import { Provider } from 'react-redux'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe('Challenge 08: Caching and Cache Tags', () => {
  const projectDir = join(__dirname, '..')

  it('API slice has providesTags on query endpoint', () => {
    const apiFile = join(projectDir, 'src/api/apiSlice.ts')
    expect(existsSync(apiFile)).toBe(true)
    const content = readFileSync(apiFile, 'utf-8')
    expect(content).toContain('providesTags')
  })

  it('API slice has invalidatesTags on mutation or tagTypes', () => {
    const apiFile = join(projectDir, 'src/api/apiSlice.ts')
    const content = readFileSync(apiFile, 'utf-8')
    expect(content).toMatch(/invalidatesTags|tagTypes/)
  })

  it('post creation invalidates the cached posts list and refetches it', async () => {
    const getPosts = vi.spyOn(mockApi, 'getPosts')
    const createPost = vi.spyOn(mockApi, 'createPost')
    const store = configureStore({
      reducer: { [apiSlice.reducerPath]: apiSlice.reducer },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    })

    const subscription = store.dispatch(apiSlice.endpoints.getPosts.initiate())
    await subscription
    expect(getPosts).toHaveBeenCalledTimes(1)

    await store.dispatch(apiSlice.endpoints.addPost.initiate({
      userId: 1,
      title: 'Cached post',
      body: 'Created for the cache test',
    }))
    await vi.waitFor(() => expect(getPosts).toHaveBeenCalledTimes(2))
    expect(createPost).toHaveBeenCalledTimes(1)

    subscription.unsubscribe()
    store.dispatch(apiSlice.util.resetApiState())
    vi.restoreAllMocks()
  })

  it('renders posts through the generated query hook', async () => {
    const getPosts = vi.spyOn(mockApi, 'getPosts').mockResolvedValueOnce([
      { id: 21, userId: 1, title: 'Query post', body: 'Fetched from mock API' },
    ])
    const store = configureStore({
      reducer: { [apiSlice.reducerPath]: apiSlice.reducer },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    })

    render(
      <Provider store={store}>
        <PostsList />
      </Provider>,
    )
    expect(await screen.findByText('Query post')).toBeInTheDocument()
    getPosts.mockRestore()
    store.dispatch(apiSlice.util.resetApiState())
  })
})
