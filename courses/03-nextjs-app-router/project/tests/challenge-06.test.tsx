import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

describe('Challenge 06: Dynamic Routes', () => {
  const projectDir = join(__dirname, '..');
  const dynamicPage = join(projectDir, 'app/posts/[id]/page.tsx');
  const dynamicPageSlug = join(projectDir, 'app/posts/[slug]/page.tsx');
  const blogId = join(projectDir, 'app/blog/[id]/page.tsx');

  it('should have dynamic route segment [id] or [slug]', () => {
    expect(
      existsSync(dynamicPage) || existsSync(dynamicPageSlug) || existsSync(blogId)
    ).toBe(true);
  });

  it('should use params in page component', () => {
    const file = existsSync(dynamicPage)
      ? dynamicPage
      : existsSync(dynamicPageSlug)
        ? dynamicPageSlug
        : blogId;
    if (!existsSync(file)) {
      expect(true).toBe(false);
      return;
    }
    const content = readFileSync(file, 'utf-8');
    expect(content).toMatch(/params|params\.(id|slug)/);
  });
});
