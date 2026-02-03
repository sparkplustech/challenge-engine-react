import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Challenge 15: Redux Toolkit with Next.js', () => {
  const projectDir = join(__dirname, '..');
  const storeFile = join(projectDir, 'app/store/store.ts');
  const storeProvider = join(projectDir, 'app/providers/StoreProvider.tsx');
  const layoutFile = join(projectDir, 'app/layout.tsx');

  it('should have store with configureStore', () => {
    expect(existsSync(storeFile)).toBe(true);
    const content = readFileSync(storeFile, 'utf-8');
    expect(content).toMatch(/configureStore/);
  });

  it('should have Client Provider wrapping with Provider and store', () => {
    expect(existsSync(storeProvider)).toBe(true);
    const content = readFileSync(storeProvider, 'utf-8');
    expect(content).toMatch(/['"]use client['"]/);
    expect(content).toMatch(/Provider|store/);
  });

  it('should use useSelector or useDispatch in a Client Component', () => {
    const candidates = [
      storeProvider,
      join(projectDir, 'app/page.tsx'),
      join(projectDir, 'app/components/Counter.tsx')
    ];
    let hasHooks = false;
    for (const file of candidates) {
      if (existsSync(file)) {
        const content = readFileSync(file, 'utf-8');
        if (/['"]use client['"]/.test(content) && /useSelector|useDispatch/.test(content)) {
          hasHooks = true;
          break;
        }
      }
    }
    expect(hasHooks).toBe(true);
  });
});
