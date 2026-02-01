import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe('Challenge 01: Store Setup with configureStore', () => {
  const projectDir = join(__dirname, '..')

  it('store uses configureStore', () => {
    const storeFile = join(projectDir, 'src/store/store.ts')
    expect(existsSync(storeFile)).toBe(true)
    const content = readFileSync(storeFile, 'utf-8')
    expect(content).toContain('configureStore')
  })

  it('store exports RootState and AppDispatch', () => {
    const storeFile = join(projectDir, 'src/store/store.ts')
    const content = readFileSync(storeFile, 'utf-8')
    expect(content).toMatch(/RootState|AppDispatch/)
  })

  it('main.tsx wraps App with Provider and passes store', () => {
    const mainFile = join(projectDir, 'src/main.tsx')
    expect(existsSync(mainFile)).toBe(true)
    const content = readFileSync(mainFile, 'utf-8')
    expect(content).toContain('Provider')
    expect(content).toMatch(/store\s*[=}]|store\)/)
  })
})
