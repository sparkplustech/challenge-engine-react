import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Challenge 04: API Route Handlers', () => {
  const projectDir = join(__dirname, '..');
  const apiRoute = join(projectDir, 'app/api/posts/route.ts');
  const apiRouteJs = join(projectDir, 'app/api/posts/route.js');

  it('should have API route file', () => {
    expect(existsSync(apiRoute) || existsSync(apiRouteJs)).toBe(true);
  });

  it('should export GET that returns JSON', () => {
    const file = existsSync(apiRoute) ? apiRoute : apiRouteJs;
    if (!existsSync(file)) {
      expect(true).toBe(false);
      return;
    }
    const content = readFileSync(file, 'utf-8');
    expect(content).toMatch(/export\s+(async\s+)?function\s+GET|GET\s*:/);
    expect(content).toMatch(/Response\.json|NextResponse\.json|\.json\(/);
  });
});
