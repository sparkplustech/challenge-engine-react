import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

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
})
