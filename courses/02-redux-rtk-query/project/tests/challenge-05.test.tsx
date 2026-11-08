import { describe, it, expect, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import usersReducer, { fetchUsers } from '../src/store/slices/usersSlice'
import { mockApi } from '../src/api/mockServer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe('Challenge 05: Async Logic with createAsyncThunk', () => {
  const projectDir = join(__dirname, '..')

  it('usersSlice uses createAsyncThunk', () => {
    const sliceFile = join(projectDir, 'src/store/slices/usersSlice.ts')
    expect(existsSync(sliceFile)).toBe(true)
    const content = readFileSync(sliceFile, 'utf-8')
    expect(content).toContain('createAsyncThunk')
  })

  it('usersSlice uses extraReducers', () => {
    const sliceFile = join(projectDir, 'src/store/slices/usersSlice.ts')
    expect(existsSync(sliceFile)).toBe(true)
    const content = readFileSync(sliceFile, 'utf-8')
    expect(content).toContain('extraReducers')
  })

  it('store includes users reducer', () => {
    const storeFile = join(projectDir, 'src/store/store.ts')
    const content = readFileSync(storeFile, 'utf-8')
    expect(content).toMatch(/users|usersReducer/)
  })

  it('fetchUsers updates pending, fulfilled and rejected states', async () => {
    const store = configureStore({ reducer: { users: usersReducer } })
    const userList = [{ id: 1, name: 'User', email: 'u@example.com', username: 'user', phone: '123' }]
    const getUsers = vi.spyOn(mockApi, 'getUsers').mockResolvedValueOnce(userList)

    const pendingRequest = store.dispatch(fetchUsers())
    expect(store.getState().users.loading).toBe(true)
    await pendingRequest
    expect(store.getState().users).toEqual({ list: userList, loading: false, error: null })
    getUsers.mockRestore()

    vi.spyOn(mockApi, 'getUsers').mockRejectedValueOnce(new Error('Network failed'))
    await store.dispatch(fetchUsers())
    expect(store.getState().users.loading).toBe(false)
    expect(store.getState().users.error).toBe('Network failed')
    vi.restoreAllMocks()
  })
})
