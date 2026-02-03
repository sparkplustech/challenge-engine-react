import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

describe('Challenge 11: Error Handling', () => {
  const projectDir = join(__dirname, '..');
  const errorFile = join(projectDir, 'app/error.tsx');
  const postsError = join(projectDir, 'app/posts/error.tsx');
  const postDetailPage = join(projectDir, 'app/posts/[id]/page.tsx');

  it('should have error.tsx in app or route segment', () => {
    expect(existsSync(errorFile) || existsSync(postsError)).toBe(true);
  });

  it('should use notFound in dynamic post page', () => {
    expect(existsSync(postDetailPage)).toBe(true);
    const content = readFileSync(postDetailPage, 'utf-8');
    const hasNotFoundCall = /notFound\s*\(/.test(content);
    const hasNextNav = /from\s+['"]next\/navigation['"]/.test(content);
    expect(hasNextNav).toBe(true);
    expect(hasNotFoundCall).toBe(true);
  });
});
