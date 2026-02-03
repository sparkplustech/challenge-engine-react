import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Challenge 08: SSR (Server-Side Rendering)', () => {
  const projectDir = join(__dirname, '..');
  const postsPage = join(projectDir, 'app/posts/page.tsx');
  const dashboardPage = join(projectDir, 'app/dashboard/page.tsx');

  it('should have page with force-dynamic or cache no-store', () => {
    let hasSsr = false;
    for (const file of [postsPage, dashboardPage]) {
      if (existsSync(file)) {
        const content = readFileSync(file, 'utf-8');
        if (
          /dynamic\s*=\s*['"]force-dynamic['"]|cache:\s*['"]no-store['"]|cache:\s*"no-store"/.test(
            content
          )
        ) {
          hasSsr = true;
          break;
        }
      }
    }
    expect(hasSsr).toBe(true);
  });
});
