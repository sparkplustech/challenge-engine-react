import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Challenge 01: App Router, Pages, and Layout', () => {
  it('should have app/page.tsx', () => {
    const pageFile = join(__dirname, '../app/page.tsx');
    expect(existsSync(pageFile)).toBe(true);
  });

  it('should have app/about/page.tsx', () => {
    const aboutPage = join(__dirname, '../app/about/page.tsx');
    expect(existsSync(aboutPage)).toBe(true);
  });

  it('should use Server Components (no use client)', () => {
    const pageFile = join(__dirname, '../app/page.tsx');
    if (existsSync(pageFile)) {
      const content = readFileSync(pageFile, 'utf-8');
      expect(content).not.toContain("'use client'");
    }
  });

  it('should use Next.js Link component', () => {
    const pageFile = join(__dirname, '../app/page.tsx');
    const layoutFile = join(__dirname, '../app/layout.tsx');
    
    let hasLink = false;
    if (existsSync(pageFile)) {
      const content = readFileSync(pageFile, 'utf-8');
      hasLink = hasLink || /from ['"]next\/link['"]|import.*Link/i.test(content);
    }
    if (existsSync(layoutFile)) {
      const content = readFileSync(layoutFile, 'utf-8');
      hasLink = hasLink || /from ['"]next\/link['"]|import.*Link/i.test(content);
    }
    
    expect(hasLink).toBe(true);
  });

  it('should have proper App Router structure', () => {
    const appDir = join(__dirname, '../app');
    expect(existsSync(appDir)).toBe(true);
  });
});
