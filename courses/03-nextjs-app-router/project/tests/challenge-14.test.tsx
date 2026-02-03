import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Challenge 14: Search and Pagination', () => {
  const projectDir = join(__dirname, '..');
  const postsPage = join(projectDir, 'app/posts/page.tsx');

  it('should have page that receives searchParams', () => {
    expect(existsSync(postsPage)).toBe(true);
    const content = readFileSync(postsPage, 'utf-8');
    expect(content).toMatch(/searchParams|params\.searchParams/);
  });
});
