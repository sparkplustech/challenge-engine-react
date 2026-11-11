import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { apiSlice } from '../src/api/apiSlice'
import UsersList from '../src/components/UsersList'
import { mockApi } from '../src/api/mockServer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe('Challenge 07: Query Endpoints and useQuery Hooks', () => {
  const projectDir = join(__dirname, '..')

  it('API slice has getUsers query endpoint', () => {
    const apiFile = join(projectDir, 'src/api/apiSlice.ts')
    expect(existsSync(apiFile)).toBe(true)
    const content = readFileSync(apiFile, 'utf-8')
    expect(content).toMatch(/getUsers|builder\.query/)
  })

  it('UsersList uses useGetUsersQuery or generated query hook', () => {
    const listFile = join(projectDir, 'src/components/UsersList.tsx')
    expect(existsSync(listFile)).toBe(true)
    const content = readFileSync(listFile, 'utf-8')
    expect(content).toMatch(/useGetUsersQuery|useQuery/)
  })

  it('UsersList has users-list data-testid', () => {
    const listFile = join(projectDir, 'src/components/UsersList.tsx')
    const content = readFileSync(listFile, 'utf-8')
    expect(content).toContain('users-list')
  })

  it('renders the queried users after loading', async () => {
    vi.spyOn(mockApi, 'getUsers').mockResolvedValueOnce([
      { id: 8, name: 'Query User', email: 'query@example.com', username: 'queryuser', phone: '123' },
    ])
    const store = configureStore({
      reducer: { [apiSlice.reducerPath]: apiSlice.reducer },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    })

    render(
      <Provider store={store}>
        <UsersList />
      </Provider>,
    )

    expect(screen.getByTestId('users-loading')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('Query User')).toBeInTheDocument()
    })
    expect(screen.getByTestId('users-list')).toBeInTheDocument()
    vi.restoreAllMocks()
  })
})
