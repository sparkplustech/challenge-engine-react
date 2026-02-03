import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Challenge 12: Metadata and SEO', () => {
  const projectDir = join(__dirname, '..');
  const layoutFile = join(projectDir, 'app/layout.tsx');
  const pageFile = join(projectDir, 'app/page.tsx');
  const postsPage = join(projectDir, 'app/posts/page.tsx');

  it('should export metadata or generateMetadata with title/description', () => {
    let hasMetadata = false;
    for (const file of [layoutFile, pageFile, postsPage]) {
      if (existsSync(file)) {
        const content = readFileSync(file, 'utf-8');
        if (/export\s+const\s+metadata|generateMetadata|title:|description:/.test(content)) {
          hasMetadata = true;
          break;
        }
      }
    }
    expect(hasMetadata).toBe(true);
  });
});
