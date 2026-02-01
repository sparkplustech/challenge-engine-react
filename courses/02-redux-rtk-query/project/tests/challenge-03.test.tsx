import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe('Challenge 03: Reading and Dispatching', () => {
  const projectDir = join(__dirname, '..')

  it('hooks.ts exports useAppSelector and useAppDispatch', () => {
    const hooksFile = join(projectDir, 'src/store/hooks.ts')
    expect(existsSync(hooksFile)).toBe(true)
    const content = readFileSync(hooksFile, 'utf-8')
    expect(content).toMatch(/useAppSelector|useSelector/)
    expect(content).toMatch(/useAppDispatch|useDispatch/)
  })

  it('CounterView uses useSelector or useAppSelector', () => {
    const viewFile = join(projectDir, 'src/components/CounterView.tsx')
    expect(existsSync(viewFile)).toBe(true)
    const content = readFileSync(viewFile, 'utf-8')
    expect(content).toMatch(/useAppSelector|useSelector/)
  })

  it('CounterView has required data-testids', () => {
    const viewFile = join(projectDir, 'src/components/CounterView.tsx')
    const content = readFileSync(viewFile, 'utf-8')
    expect(content).toContain('counter-value')
    expect(content).toContain('increment-btn')
    expect(content).toContain('decrement-btn')
  })
})
