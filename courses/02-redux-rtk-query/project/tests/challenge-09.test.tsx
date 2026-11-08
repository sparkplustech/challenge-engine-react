import { describe, it, expect, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { apiSlice } from '../src/api/apiSlice'
import { mockApi } from '../src/api/mockServer'
import AddPostForm from '../src/components/AddPostForm'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe('Challenge 09: Mutations with useMutation', () => {
  const projectDir = join(__dirname, '..')

  it('API slice has builder.mutation endpoint', () => {
    const apiFile = join(projectDir, 'src/api/apiSlice.ts')
    expect(existsSync(apiFile)).toBe(true)
    const content = readFileSync(apiFile, 'utf-8')
    expect(content).toMatch(/builder\.mutation|mutation\s*:/)
  })

  it('AddPostForm uses useMutation hook', () => {
    const formFile = join(projectDir, 'src/components/AddPostForm.tsx')
    expect(existsSync(formFile)).toBe(true)
    const content = readFileSync(formFile, 'utf-8')
    expect(content).toMatch(/useMutation|useAddPostMutation|useCreatePostMutation/)
  })

  it('AddPostForm has add-post-form and add-post-submit data-testids', () => {
    const formFile = join(projectDir, 'src/components/AddPostForm.tsx')
    const content = readFileSync(formFile, 'utf-8')
    expect(content).toContain('add-post-form')
    expect(content).toContain('add-post-submit')
  })

  it('submits a post and reports success', async () => {
    const user = userEvent.setup()
    const createPost = vi.spyOn(mockApi, 'createPost').mockResolvedValueOnce({
      id: 20,
      userId: 1,
      title: 'Submitted post',
      body: 'Mutation body',
    })
    const store = configureStore({
      reducer: { [apiSlice.reducerPath]: apiSlice.reducer },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    })

    render(
      <Provider store={store}>
        <AddPostForm />
      </Provider>,
    )
    await user.type(screen.getByLabelText('Title'), 'Submitted post')
    await user.type(screen.getByLabelText('Body'), 'Mutation body')
    await user.click(screen.getByTestId('add-post-submit'))

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Post added successfully')
    })
    expect(createPost).toHaveBeenCalledWith({
      userId: 1,
      title: 'Submitted post',
      body: 'Mutation body',
    })
    vi.restoreAllMocks()
    store.dispatch(apiSlice.util.resetApiState())
  })
})
