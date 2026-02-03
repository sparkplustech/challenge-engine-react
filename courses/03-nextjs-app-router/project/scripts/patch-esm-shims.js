/**
 * Creates missing ESM (.mjs) shims for dependencies that declare ESM but only ship CJS.
 * Required for Vitest to run on Node when these packages are resolved as ESM.
 * Run automatically after npm install (postinstall).
 */
const fs = require('fs');
const path = require('path');

const projectDir = path.resolve(__dirname, '..');
const nodeModules = path.join(projectDir, 'node_modules');

const shims = [
  {
    dir: path.join(nodeModules, 'std-env', 'dist'),
    file: 'index.mjs',
    content: `import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const cjs = require('./index.cjs');
export const env = cjs.env;
export const hasTTY = cjs.hasTTY;
export const hasWindow = cjs.hasWindow;
export const isBun = cjs.isBun;
export const isCI = cjs.isCI;
export const isColorSupported = cjs.isColorSupported;
export const isDebug = cjs.isDebug;
export const isDeno = cjs.isDeno;
export const isDevelopment = cjs.isDevelopment;
export const isEdgeLight = cjs.isEdgeLight;
export const isFastly = cjs.isFastly;
export const isLinux = cjs.isLinux;
export const isMacOS = cjs.isMacOS;
export const isMinimal = cjs.isMinimal;
export const isNetlify = cjs.isNetlify;
export const isNode = cjs.isNode;
export const isProduction = cjs.isProduction;
export const isTest = cjs.isTest;
export const isWindows = cjs.isWindows;
export const isWorkerd = cjs.isWorkerd;
export const nodeENV = cjs.nodeENV;
export const nodeMajorVersion = cjs.nodeMajorVersion;
export const nodeVersion = cjs.nodeVersion;
export const platform = cjs.platform;
export const process = cjs.process;
export const provider = cjs.provider;
export const providerInfo = cjs.providerInfo;
export const runtime = cjs.runtime;
export const runtimeInfo = cjs.runtimeInfo;
export default cjs;
`,
  },
  {
    dir: path.join(nodeModules, 'acorn-walk', 'dist'),
    file: 'walk.mjs',
    content: `import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const cjs = require('./walk.js');
export const ancestor = cjs.ancestor;
export const base = cjs.base;
export const findNodeAfter = cjs.findNodeAfter;
export const findNodeAround = cjs.findNodeAround;
export const findNodeAt = cjs.findNodeAt;
export const findNodeBefore = cjs.findNodeBefore;
export const full = cjs.full;
export const fullAncestor = cjs.fullAncestor;
export const make = cjs.make;
export const recursive = cjs.recursive;
export const simple = cjs.simple;
export default cjs;
`,
  },
  {
    dir: path.join(nodeModules, 'strip-literal', 'dist'),
    file: 'index.mjs',
    content: `import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const cjs = require('./index.cjs');
export const stripLiteral = cjs.stripLiteral;
export const stripLiteralDetailed = cjs.stripLiteralDetailed;
export const stripLiteralJsTokens = cjs.stripLiteralJsTokens;
export default cjs;
`,
  },
];

for (const { dir, file, content } of shims) {
  const cjsPath = path.join(dir, file === 'index.mjs' ? 'index.cjs' : 'walk.js');
  if (!fs.existsSync(cjsPath)) continue;
  const outPath = path.join(dir, file);
  try {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, content, 'utf8');
  } catch (err) {
    console.warn('patch-esm-shims: could not write', outPath, err.message);
  }
}
