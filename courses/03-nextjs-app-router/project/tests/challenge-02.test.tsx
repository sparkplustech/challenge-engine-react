import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

describe('Challenge 02: Server and Client Components', () => {
  const projectDir = join(__dirname, '..');

  it('should have at least one Client Component with use client', () => {
    const candidates = [
      join(projectDir, 'app/components/Counter.tsx'),
      join(projectDir, 'app/components/InteractiveWidget.tsx'),
      join(projectDir, 'app/dashboard/InteractiveWidget.tsx'),
      join(projectDir, 'app/contact/form.tsx'),
      join(projectDir, 'app/page.tsx')
    ];
    let hasUseClient = false;
    for (const file of candidates) {
      if (existsSync(file)) {
        const content = readFileSync(file, 'utf-8');
        if (/['"]use client['"]/.test(content)) {
          hasUseClient = true;
          break;
        }
      }
    }
    if (!hasUseClient) {
      const appDir = join(projectDir, 'app');
      const walk = (dir: string) => {
        try {
          const entries = readdirSync(dir, { withFileTypes: true });
          for (const e of entries) {
            const full = join(dir, e.name);
            if (e.isDirectory() && !e.name.startsWith('.')) walk(full);
            else if (e.isFile() && /\.(tsx|jsx)$/.test(e.name)) {
              const content = readFileSync(full, 'utf-8');
              if (/['"]use client['"]/.test(content)) { hasUseClient = true; return; }
            }
          }
        } catch (_) {}
      };
      walk(appDir);
    }
    expect(hasUseClient).toBe(true);
  });

  it('should have Client Component that uses state or event handlers', () => {
    const candidates = [
      join(projectDir, 'app/components/Counter.tsx'),
      join(projectDir, 'app/components/InteractiveWidget.tsx'),
      join(projectDir, 'app/components/ThemeToggle.tsx'),
      join(projectDir, 'app/dashboard/InteractiveWidget.tsx'),
      join(projectDir, 'app/contact/form.tsx'),
      join(projectDir, 'app/page.tsx')
    ];
    let hasStateOrHandler = false;
    for (const file of candidates) {
      if (existsSync(file)) {
        const content = readFileSync(file, 'utf-8');
        if (/['"]use client['"]/.test(content) && (/useState|onClick|onChange|onSubmit/.test(content))) {
          hasStateOrHandler = true;
          break;
        }
      }
    }
    if (!hasStateOrHandler) {
      const appDir = join(projectDir, 'app');
      const walk = (dir: string): boolean => {
        try {
          const entries = readdirSync(dir, { withFileTypes: true });
          for (const e of entries) {
            const full = join(dir, e.name);
            if (e.isDirectory() && !e.name.startsWith('.')) {
              if (walk(full)) return true;
            } else if (e.isFile() && /\.(tsx|jsx)$/.test(e.name)) {
              const content = readFileSync(full, 'utf-8');
              if (/['"]use client['"]/.test(content) && (/useState|onClick|onChange|onSubmit/.test(content))) {
                hasStateOrHandler = true;
                return true;
              }
            }
          }
        } catch (_) {}
        return false;
      };
      walk(appDir);
    }
    expect(hasStateOrHandler).toBe(true);
  });

  it('should have App Router structure', () => {
    expect(existsSync(join(projectDir, 'app'))).toBe(true);
    expect(existsSync(join(projectDir, 'app/page.tsx'))).toBe(true);
  });
});
