import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe('Challenge 11: API and Local State Together', () => {
  const projectDir = join(__dirname, '..')

  it('filtersSlice exists and is in store', () => {
    const sliceFile = join(projectDir, 'src/store/slices/filtersSlice.ts')
    expect(existsSync(sliceFile)).toBe(true)
    const storeFile = join(projectDir, 'src/store/store.ts')
    const storeContent = readFileSync(storeFile, 'utf-8')
    expect(storeContent).toMatch(/filters|filtersSlice|filtersReducer/)
  })

  it('PostsWithFilters uses useSelector and useGetPostsQuery or query hook', () => {
    const viewFile = join(projectDir, 'src/components/PostsWithFilters.tsx')
    expect(existsSync(viewFile)).toBe(true)
    const content = readFileSync(viewFile, 'utf-8')
    expect(content).toMatch(/useAppSelector|useSelector/)
    expect(content).toMatch(/useGetPostsQuery|useQuery|getPosts/)
  })

  it('PostsWithFilters has posts-with-filters and filter-controls data-testids', () => {
    const viewFile = join(projectDir, 'src/components/PostsWithFilters.tsx')
    const content = readFileSync(viewFile, 'utf-8')
    expect(content).toContain('posts-with-filters')
    expect(content).toContain('filter-controls')
  })
})
