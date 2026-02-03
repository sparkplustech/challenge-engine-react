import { describe, it, expect } from 'vitest'
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
})
