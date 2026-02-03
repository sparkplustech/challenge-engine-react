import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Challenge 09: Server Actions and Revalidation', () => {
  const projectDir = join(__dirname, '..');
  const actionsFile = join(projectDir, 'app/actions.ts');
  const actionsAlt = join(projectDir, 'app/actions.js');

  it('should have use server in a file', () => {
    let hasUseServer = false;
    if (existsSync(actionsFile)) {
      const content = readFileSync(actionsFile, 'utf-8');
      hasUseServer = /['"]use server['"]/.test(content);
    }
    if (!hasUseServer && existsSync(actionsAlt)) {
      const content = readFileSync(actionsAlt, 'utf-8');
      hasUseServer = /['"]use server['"]/.test(content);
    }
    expect(hasUseServer).toBe(true);
  });

  it('should call revalidatePath or revalidateTag', () => {
    let hasRevalidate = false;
    if (existsSync(actionsFile)) {
      const content = readFileSync(actionsFile, 'utf-8');
      hasRevalidate = /revalidatePath|revalidateTag/.test(content);
    }
    if (!hasRevalidate && existsSync(actionsAlt)) {
      const content = readFileSync(actionsAlt, 'utf-8');
      hasRevalidate = /revalidatePath|revalidateTag/.test(content);
    }
    expect(hasRevalidate).toBe(true);
  });
});
