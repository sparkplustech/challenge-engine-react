import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Challenge 13: Images and Fonts', () => {
  const projectDir = join(__dirname, '..');
  const pageFile = join(projectDir, 'app/page.tsx');
  const layoutFile = join(projectDir, 'app/layout.tsx');

  it('should use next/image', () => {
    let hasImage = false;
    if (existsSync(pageFile)) {
      const content = readFileSync(pageFile, 'utf-8');
      hasImage = /from\s+['"]next\/image['"]|import.*Image.*next\/image/.test(content);
    }
    expect(hasImage).toBe(true);
  });

  it('should use next/font', () => {
    let hasFont = false;
    if (existsSync(layoutFile)) {
      const content = readFileSync(layoutFile, 'utf-8');
      hasFont = /from\s+['"]next\/font|next\/font\/google|next\/font\/local/.test(content);
    }
    expect(hasFont).toBe(true);
  });
});
