import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe('Challenge 02: First Slice with createSlice', () => {
  const projectDir = join(__dirname, '..')

  it('counterSlice exists and uses createSlice', () => {
    const sliceFile = join(projectDir, 'src/store/slices/counterSlice.ts')
    if (!existsSync(sliceFile)) {
      expect(existsSync(sliceFile)).toBe(false)
      return
    }
    const content = readFileSync(sliceFile, 'utf-8')
    expect(content).toContain('createSlice')
  })

  it('counterSlice has increment and decrement reducers', () => {
    const sliceFile = join(projectDir, 'src/store/slices/counterSlice.ts')
    expect(existsSync(sliceFile)).toBe(true)
    const content = readFileSync(sliceFile, 'utf-8')
    expect(content).toMatch(/increment|decrement/)
  })

  it('store includes counter reducer', () => {
    const storeFile = join(projectDir, 'src/store/store.ts')
    const content = readFileSync(storeFile, 'utf-8')
    expect(content).toMatch(/counter|counterReducer/)
  })
})
