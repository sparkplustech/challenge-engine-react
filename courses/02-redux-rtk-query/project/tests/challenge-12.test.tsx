import { describe, it, expect, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { apiSlice } from '../src/api/apiSlice'
import { mockApi } from '../src/api/mockServer'
import UsersList from '../src/components/UsersList'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe('Challenge 12: Error and Loading UX', () => {
  const projectDir = join(__dirname, '..')

  it('ErrorDisplay exists with error-display and retry-btn data-testids', () => {
    const compFile = join(projectDir, 'src/components/ErrorDisplay.tsx')
    expect(existsSync(compFile)).toBe(true)
    const content = readFileSync(compFile, 'utf-8')
    expect(content).toContain('error-display')
    expect(content).toContain('retry-btn')
  })

  it('UsersList or main list uses refetch', () => {
    const listFile = join(projectDir, 'src/components/UsersList.tsx')
    expect(existsSync(listFile)).toBe(true)
    const content = readFileSync(listFile, 'utf-8')
    expect(content).toMatch(/refetch|isLoading|isError/)
  })

  it('loading or error state has visible indicator', () => {
    const listFile = join(projectDir, 'src/components/UsersList.tsx')
    const content = readFileSync(listFile, 'utf-8')
    expect(content).toMatch(/users-loading|Loading|isLoading|isError|ErrorDisplay/)
  })

  it('shows an error and retries the users query successfully', async () => {
    const user = userEvent.setup()
    vi.spyOn(mockApi, 'getUsers')
      .mockRejectedValueOnce(new Error('Users unavailable'))
      .mockResolvedValueOnce([
        { id: 8, name: 'Recovered User', email: 'recovered@example.com', username: 'recovered', phone: '123' },
      ])
    const store = configureStore({
      reducer: { [apiSlice.reducerPath]: apiSlice.reducer },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    })

    const { unmount } = render(
      <Provider store={store}>
        <UsersList />
      </Provider>,
    )

    expect(await screen.findByTestId('error-display')).toHaveTextContent('Users unavailable')
    await user.click(screen.getByTestId('retry-btn'))
    expect(await screen.findByText('Recovered User')).toBeInTheDocument()

    unmount()
    store.dispatch(apiSlice.util.resetApiState())
    vi.restoreAllMocks()
  })
})
