import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe('Challenge 12: Error and Loading UX', () => {
  const projectDir = join(__dirname, '..')

  it('ErrorDisplay exists with error-display and retry-btn data-testids', () => {
    const compFile = join(projectDir, 'src/components/ErrorDisplay.tsx')
    expect(existsSync(compFile)).toBe(true)
    const content = readFileSync(compFile, 'utf-8')
    expect(content).toContain('error-display')
    expect(content).toContain('retry-btn')
  })

  it('UsersList or main list uses refetch', () => {
    const listFile = join(projectDir, 'src/components/UsersList.tsx')
    expect(existsSync(listFile)).toBe(true)
    const content = readFileSync(listFile, 'utf-8')
    expect(content).toMatch(/refetch|isLoading|isError/)
  })

  it('loading or error state has visible indicator', () => {
    const listFile = join(projectDir, 'src/components/UsersList.tsx')
    const content = readFileSync(listFile, 'utf-8')
    expect(content).toMatch(/users-loading|Loading|isLoading|isError|ErrorDisplay/)
  })
})
