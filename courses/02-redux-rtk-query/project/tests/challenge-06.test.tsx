import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { apiSlice } from '../src/api/apiSlice'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe('Challenge 06: RTK Query Setup', () => {
  const projectDir = join(__dirname, '..')

  it('apiSlice uses createApi', () => {
    const apiFile = join(projectDir, 'src/api/apiSlice.ts')
    expect(existsSync(apiFile)).toBe(true)
    const content = readFileSync(apiFile, 'utf-8')
    expect(content).toContain('createApi')
  })

  it('apiSlice has baseQuery or fetchBaseQuery', () => {
    const apiFile = join(projectDir, 'src/api/apiSlice.ts')
    expect(existsSync(apiFile)).toBe(true)
    const content = readFileSync(apiFile, 'utf-8')
    expect(content).toMatch(/baseQuery|fetchBaseQuery/)
  })

  it('store includes API reducer and middleware', () => {
    const storeFile = join(projectDir, 'src/store/store.ts')
    const content = readFileSync(storeFile, 'utf-8')
    expect(content).toMatch(/reducerPath|apiSlice\.reducer|middleware/)
  })

  it('API slice exposes a users query that resolves mock data', async () => {
    const endpoint = apiSlice.endpoints.getUsers
    const store = (await import('../src/store/store')).store
    const result = await store.dispatch(endpoint.initiate())
    expect(result.data).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 1, name: 'John Doe' }),
    ]))
  })
})
