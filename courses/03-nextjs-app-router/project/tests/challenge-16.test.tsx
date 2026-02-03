import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Challenge 16: RTK Query with Next.js', () => {
  const projectDir = join(__dirname, '..');
  const apiSlice = join(projectDir, 'app/store/apiSlice.ts');
  const storeFile = join(projectDir, 'app/store/store.ts');

  it('should have createApi and fetchBaseQuery', () => {
    expect(existsSync(apiSlice)).toBe(true);
    const content = readFileSync(apiSlice, 'utf-8');
    expect(content).toMatch(/createApi|fetchBaseQuery/);
  });

  it('should add API reducer and middleware to store', () => {
    expect(existsSync(storeFile)).toBe(true);
    const content = readFileSync(storeFile, 'utf-8');
    expect(content).toMatch(/reducerPath|api\.reducer|api\.middleware/);
  });
});
