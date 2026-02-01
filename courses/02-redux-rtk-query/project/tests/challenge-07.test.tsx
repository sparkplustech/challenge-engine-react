import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe('Challenge 07: Query Endpoints and useQuery Hooks', () => {
  const projectDir = join(__dirname, '..')

  it('API slice has getUsers query endpoint', () => {
    const apiFile = join(projectDir, 'src/api/apiSlice.ts')
    expect(existsSync(apiFile)).toBe(true)
    const content = readFileSync(apiFile, 'utf-8')
    expect(content).toMatch(/getUsers|builder\.query/)
  })

  it('UsersList uses useGetUsersQuery or generated query hook', () => {
    const listFile = join(projectDir, 'src/components/UsersList.tsx')
    expect(existsSync(listFile)).toBe(true)
    const content = readFileSync(listFile, 'utf-8')
    expect(content).toMatch(/useGetUsersQuery|useQuery/)
  })

  it('UsersList has users-list data-testid', () => {
    const listFile = join(projectDir, 'src/components/UsersList.tsx')
    const content = readFileSync(listFile, 'utf-8')
    expect(content).toContain('users-list')
  })
})
