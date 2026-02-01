import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe('Challenge 08: Caching and Cache Tags', () => {
  const projectDir = join(__dirname, '..')

  it('API slice has providesTags on query endpoint', () => {
    const apiFile = join(projectDir, 'src/api/apiSlice.ts')
    expect(existsSync(apiFile)).toBe(true)
    const content = readFileSync(apiFile, 'utf-8')
    expect(content).toContain('providesTags')
  })

  it('API slice has invalidatesTags on mutation or tagTypes', () => {
    const apiFile = join(projectDir, 'src/api/apiSlice.ts')
    const content = readFileSync(apiFile, 'utf-8')
    expect(content).toMatch(/invalidatesTags|tagTypes/)
  })
})
