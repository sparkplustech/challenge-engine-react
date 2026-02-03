import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Challenge 10: Caching and Revalidating', () => {
  const projectDir = join(__dirname, '..');
  const postsPage = join(projectDir, 'app/posts/page.tsx');
  const actionsFile = join(projectDir, 'app/actions.ts');

  it('should have fetch with cache options or revalidate', () => {
    let hasCacheOrRevalidate = false;
    if (existsSync(postsPage)) {
      const content = readFileSync(postsPage, 'utf-8');
      if (/next:\s*\{|revalidate:|cache:\s*['"]force-cache['"]/.test(content)) {
        hasCacheOrRevalidate = true;
      }
    }
    if (!hasCacheOrRevalidate && existsSync(actionsFile)) {
      const content = readFileSync(actionsFile, 'utf-8');
      hasCacheOrRevalidate = /revalidatePath|revalidateTag/.test(content);
    }
    expect(hasCacheOrRevalidate).toBe(true);
  });
});
