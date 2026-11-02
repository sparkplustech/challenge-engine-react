import { describe, it, expect, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { apiSlice } from '../src/api/apiSlice'
import { mockApi } from '../src/api/mockServer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe('Challenge 10: Optimistic Updates', () => {
  const projectDir = join(__dirname, '..')

  it('API slice mutation has onQueryStarted', () => {
    const apiFile = join(projectDir, 'src/api/apiSlice.ts')
    expect(existsSync(apiFile)).toBe(true)
    const content = readFileSync(apiFile, 'utf-8')
    expect(content).toContain('onQueryStarted')
  })

  it('optimistic update uses queryFulfilled or updateQueryData', () => {
    const apiFile = join(projectDir, 'src/api/apiSlice.ts')
    const content = readFileSync(apiFile, 'utf-8')
    expect(content).toMatch(/queryFulfilled|updateQueryData/)
  })

  it('has rollback or undo on error', () => {
    const apiFile = join(projectDir, 'src/api/apiSlice.ts')
    const content = readFileSync(apiFile, 'utf-8')
    expect(content).toMatch(/undo|rollback|patchResult/)
  })

  it('updates the posts cache immediately and rolls it back when creation fails', async () => {
    let rejectCreatePost: (error: Error) => void = () => {
      throw new Error('Post creation was not started')
    }
    const originalPosts = [
      { id: 21, userId: 1, title: 'Existing post', body: 'Already cached' },
    ]
    vi.spyOn(mockApi, 'getPosts').mockResolvedValueOnce(originalPosts)
    vi.spyOn(mockApi, 'createPost').mockImplementation(
      () => new Promise((_, reject) => {
        rejectCreatePost = reject
      }),
    )
    const store = configureStore({
      reducer: { [apiSlice.reducerPath]: apiSlice.reducer },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    })

    const subscription = store.dispatch(apiSlice.endpoints.getPosts.initiate())
    await subscription
    subscription.unsubscribe()

    const mutation = store.dispatch(apiSlice.endpoints.addPost.initiate({
      userId: 1,
      title: 'Optimistic post',
      body: 'This should be rolled back',
    }))
    const selectPosts = () => apiSlice.endpoints.getPosts.select()(store.getState()).data

    await vi.waitFor(() => {
      expect(selectPosts()).toHaveLength(2)
    })
    expect(selectPosts()?.[1]).toMatchObject({
      userId: 1,
      title: 'Optimistic post',
      body: 'This should be rolled back',
    })

    rejectCreatePost(new Error('Request failed'))
    await mutation

    expect(selectPosts()).toEqual(originalPosts)
    store.dispatch(apiSlice.util.resetApiState())
    vi.restoreAllMocks()
  })
})
