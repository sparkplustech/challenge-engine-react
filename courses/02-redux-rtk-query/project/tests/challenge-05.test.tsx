import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

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
})
