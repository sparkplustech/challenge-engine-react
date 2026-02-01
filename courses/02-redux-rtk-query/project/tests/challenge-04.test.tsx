import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe('Challenge 04: Multiple Slices', () => {
  const projectDir = join(__dirname, '..')

  it('uiSlice exists and uses createSlice', () => {
    const sliceFile = join(projectDir, 'src/store/slices/uiSlice.ts')
    expect(existsSync(sliceFile)).toBe(true)
    const content = readFileSync(sliceFile, 'utf-8')
    expect(content).toContain('createSlice')
  })

  it('store includes both counter and ui reducers', () => {
    const storeFile = join(projectDir, 'src/store/store.ts')
    const content = readFileSync(storeFile, 'utf-8')
    expect(content).toMatch(/counter|counterReducer/)
    expect(content).toMatch(/ui|uiReducer/)
  })
})
