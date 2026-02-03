import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Challenge 03: Data Fetching in Server Components', () => {
  const projectDir = join(__dirname, '..');
  const postsPage = join(projectDir, 'app/posts/page.tsx');

  it('should have posts page (or equivalent data page)', () => {
    expect(existsSync(postsPage)).toBe(true);
  });

  it('should have async Server Component', () => {
    if (!existsSync(postsPage)) {
      expect(true).toBe(false);
      return;
    }
    const content = readFileSync(postsPage, 'utf-8');
    expect(content).toMatch(/async\s+(function|export|default)/);
  });

  it('should fetch data in Server Component', () => {
    if (!existsSync(postsPage)) {
      expect(true).toBe(false);
      return;
    }
    const content = readFileSync(postsPage, 'utf-8');
    expect(content).toMatch(/fetch|await|async/);
  });
});
