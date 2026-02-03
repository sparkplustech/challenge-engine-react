import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

describe('Challenge 05: Loading and Streaming', () => {
  const projectDir = join(__dirname, '..');
  const loadingFile = join(projectDir, 'app/posts/loading.tsx');
  const loadingJs = join(projectDir, 'app/posts/loading.js');

  it('should have loading.tsx in a route segment', () => {
    expect(existsSync(loadingFile) || existsSync(loadingJs)).toBe(true);
  });

  it('should export default loading component', () => {
    const file = existsSync(loadingFile) ? loadingFile : loadingJs;
    if (!existsSync(file)) {
      expect(true).toBe(false);
      return;
    }
    const content = readFileSync(file, 'utf-8');
    expect(content).toMatch(/export\s+default|export\s+default\s+function/);
  });
});
