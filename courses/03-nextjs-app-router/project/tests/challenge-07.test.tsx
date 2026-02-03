import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Challenge 07: Static and Dynamic Rendering', () => {
  const projectDir = join(__dirname, '..');
  const pagePath = join(projectDir, 'app/page.tsx');
  const postsPath = join(projectDir, 'app/posts/page.tsx');

  it('should have at least one page with dynamic export or dynamic APIs', () => {
    let hasDynamic = false;
    for (const file of [pagePath, postsPath]) {
      if (existsSync(file)) {
        const content = readFileSync(file, 'utf-8');
        if (
          /export\s+const\s+dynamic\s*=|force-static|force-dynamic|headers\(\)|cookies\(\)|searchParams/.test(
            content
          )
        ) {
          hasDynamic = true;
          break;
        }
      }
    }
    expect(hasDynamic).toBe(true);
  });
});
