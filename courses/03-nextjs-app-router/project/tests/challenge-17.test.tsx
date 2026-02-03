import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Challenge 17: Fullstack Capstone', () => {
  const projectDir = join(__dirname, '..');
  const dynamicPage = join(projectDir, 'app/posts/[id]/page.tsx');
  const errorFile = join(projectDir, 'app/error.tsx');
  const postsError = join(projectDir, 'app/posts/error.tsx');
  const notFoundFile = join(projectDir, 'app/not-found.tsx');

  it('should have dynamic route page', () => {
    expect(existsSync(dynamicPage)).toBe(true);
  });

  it('should have error.tsx or not-found.tsx', () => {
    expect(
      existsSync(errorFile) || existsSync(postsError) || existsSync(notFoundFile)
    ).toBe(true);
  });

  it('should have metadata or generateMetadata on dynamic page', () => {
    if (!existsSync(dynamicPage)) {
      expect(true).toBe(false);
      return;
    }
    const content = readFileSync(dynamicPage, 'utf-8');
    expect(content).toMatch(/metadata|generateMetadata/);
  });
});
