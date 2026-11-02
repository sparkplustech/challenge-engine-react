import { describe, it, expect, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { mockApi } from '../src/api/mockServer'
import { apiSlice } from '../src/api/apiSlice'
import PostDetail from '../src/components/PostDetail'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe('Challenge 13: Query with Parameters and Detail View', () => {
  const projectDir = join(__dirname, '..')

  it('API slice has getPostById query endpoint', () => {
    const apiFile = join(projectDir, 'src/api/apiSlice.ts')
    expect(existsSync(apiFile)).toBe(true)
    const content = readFileSync(apiFile, 'utf-8')
    expect(content).toContain('getPostById')
  })

  it('PostDetail uses useGetPostByIdQuery or generated query hook', () => {
    const detailFile = join(projectDir, 'src/components/PostDetail.tsx')
    expect(existsSync(detailFile)).toBe(true)
    const content = readFileSync(detailFile, 'utf-8')
    expect(content).toMatch(/useGetPostByIdQuery|useQuery/)
  })

  it('PostDetail has post-detail data-testid', () => {
    const detailFile = join(projectDir, 'src/components/PostDetail.tsx')
    const content = readFileSync(detailFile, 'utf-8')
    expect(content).toContain('post-detail')
  })

  it('fetches and renders the post selected by the route parameter', async () => {
    const getPostById = vi.spyOn(mockApi, 'getPostById').mockResolvedValueOnce({
      id: 8,
      userId: 3,
      title: 'Parameterized post',
      body: 'Loaded by id',
    })
    const store = configureStore({
      reducer: { [apiSlice.reducerPath]: apiSlice.reducer },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    })

    const { unmount } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/posts/8']}>
          <Routes>
            <Route path="/posts/:postId" element={<PostDetail />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    )

    expect(await screen.findByTestId('post-detail')).toHaveTextContent('Parameterized post')
    expect(getPostById).toHaveBeenCalledWith(8)

    unmount()
    store.dispatch(apiSlice.util.resetApiState())
    vi.restoreAllMocks()
  })
})
