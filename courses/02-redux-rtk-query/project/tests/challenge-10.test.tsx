import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

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
})
