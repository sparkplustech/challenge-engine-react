import { readFileSync, existsSync, readdirSync } from 'fs';
import { dirname, extname, join, relative } from 'path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

/**
 * Checks architecture patterns using AST parsing
 * Adapted for Next.js App Router patterns
 */
export async function checkArchitecture(challengeMetadata, projectDir) {

  if (challengeMetadata.challengeId === '01-app-router-pages-layout') {
    return checkChallenge01Architecture(challengeMetadata, projectDir);
  }
  if (challengeMetadata.challengeId === '02-server-and-client-components') {
    return checkChallenge02Architecture(projectDir);
  }
  if (challengeMetadata.challengeId === '03-data-fetching-server') {
    return checkChallenge03Architecture(challengeMetadata, projectDir);
  }
  if (challengeMetadata.challengeId === '04-api-route-handlers') {
    return checkChallenge04Architecture(challengeMetadata, projectDir);
  }
  if (challengeMetadata.challengeId === '05-loading-and-streaming') {
    return checkChallenge05Architecture(challengeMetadata, projectDir);
  }
  if (challengeMetadata.challengeId === '06-dynamic-routes') {
    return checkChallenge06Architecture(challengeMetadata, projectDir);
  }
  if (challengeMetadata.challengeId === '07-static-and-dynamic-rendering') {
    return checkChallenge07Architecture(challengeMetadata, projectDir);
  }
  if (challengeMetadata.challengeId === '08-ssr-dynamic-rendering') {
    return checkChallenge08Architecture(challengeMetadata, projectDir);
  }
  if (challengeMetadata.challengeId === '09-server-actions-and-revalidation') {
    return checkChallenge09Architecture(challengeMetadata, projectDir);
  }
  if (challengeMetadata.challengeId === '10-caching-and-revalidating') {
    return checkChallenge10Architecture(challengeMetadata, projectDir);
  }
  if (challengeMetadata.challengeId === '11-error-handling') {
    return checkChallenge11Architecture(projectDir);
  }
  if (challengeMetadata.challengeId === '12-metadata-and-seo') {
    return checkChallenge12Architecture(challengeMetadata, projectDir);
  }
  if (challengeMetadata.challengeId === '13-images-and-fonts') {
    return checkChallenge13Architecture(challengeMetadata, projectDir);
  }
  if (challengeMetadata.challengeId === '14-search-and-pagination') {
    return checkChallenge14Architecture(challengeMetadata, projectDir);
  }
  if (challengeMetadata.challengeId === '15-redux-toolkit-with-nextjs') {
    return checkChallenge15Architecture(projectDir);
  }
  if (challengeMetadata.challengeId === '16-rtk-query-with-nextjs') {
    return checkChallenge16Architecture(projectDir);
  }
  if (challengeMetadata.challengeId === '17-fullstack-capstone') {
    return checkChallenge17Architecture(projectDir);
  }

  const patternsRequired = challengeMetadata.patternsRequired || [];
  const filesToCheck = challengeMetadata.filesToCheck || [];
  
  if (patternsRequired.length === 0) {
    return {
      score: 100,
      passed: true,
      details: []
    };
  }

  const results = {
    score: 0,
    passed: false,
    patternsFound: [],
    patternsMissing: [],
    details: []
  };

  let totalChecks = 0;
  let passedChecks = 0;

  for (const file of filesToCheck) {
    const filePath = join(projectDir, file);
    
    if (!existsSync(filePath)) {
      results.details.push({
        file,
        error: 'File does not exist',
        patternsFound: [],
        patternsMissing: patternsRequired
      });
      continue;
    }

    try {
      const fileContent = readFileSync(filePath, 'utf-8');
      const fileResults = checkFileForPatterns(fileContent, patternsRequired, file);
      
      totalChecks += patternsRequired.length;
      passedChecks += fileResults.patternsFound.length;
      
      results.patternsFound.push(...fileResults.patternsFound);
      results.patternsMissing.push(...fileResults.patternsMissing);
      results.details.push({
        file,
        patternsFound: fileResults.patternsFound,
        patternsMissing: fileResults.patternsMissing
      });
    } catch (error) {
      results.details.push({
        file,
        error: error.message,
        patternsFound: [],
        patternsMissing: patternsRequired
      });
    }
  }

  // Calculate score
  results.score = totalChecks > 0 
    ? Math.round((passedChecks / totalChecks) * 100 * 10) / 10
    : 0;
  
  results.passed = results.score >= 80;

  return results;
}

function checkChallenge01Architecture(challengeMetadata, projectDir) {
  const pageFiles = new Set(['app/page.tsx', 'app/about/page.tsx']);
  const filesToCheck = challengeMetadata.filesToCheck || [];
  const fileResults = filesToCheck.map((file) => {
    const normalizedFile = file.replace(/\\/g, '/');
    const exists = existsSync(join(projectDir, file));
    const content = exists ? readFileSync(join(projectDir, file), 'utf-8') : '';
    const requiredPatterns = ['appDirectory', 'serverComponent'];
    const patternsFound = [];
    const patternsMissing = [];

    if (pageFiles.has(normalizedFile)) {
      requiredPatterns.push('fileBasedRouting');
    }

    for (const pattern of requiredPatterns) {
      const found = pattern === 'appDirectory'
        ? exists && normalizedFile.startsWith('app/')
        : pattern === 'fileBasedRouting'
          ? exists && /^app\/(?:.+\/)?page\.(?:tsx|ts)$/.test(normalizedFile)
          : exists && isServerComponent(content);

      (found ? patternsFound : patternsMissing).push(pattern);
    }

    return { file: normalizedFile, content, patternsFound, patternsMissing };
  });

  const getFile = (name) => fileResults.find((result) => result.file === name);
  const homePage = getFile('app/page.tsx');
  const aboutPage = getFile('app/about/page.tsx');
  const layout = getFile('app/layout.tsx');
  const aboutLink = [homePage, layout].some((file) =>
    file && hasNextLink(file.content) && hasLinkWithHrefAndText(file.content, '/about', 'About'),
  );
  const homeLink = Boolean(
    aboutPage && hasNextLink(aboutPage.content) &&
    hasLinkWithHrefAndText(aboutPage.content, '/', 'Home'),
  );
  const hasNavigation = aboutLink && homeLink;
  const details = [
    ...fileResults.map(({ file, patternsFound, patternsMissing }) => ({
      file,
      patternsFound,
      patternsMissing,
    })),
    {
      file: 'navigation',
      patternsFound: hasNavigation ? ['Link'] : [],
      patternsMissing: hasNavigation ? [] : ['Link'],
    },
  ];
  const totalChecks = details.reduce(
    (total, result) => total + result.patternsFound.length + result.patternsMissing.length,
    0,
  );
  const passedChecks = details.reduce(
    (total, result) => total + result.patternsFound.length,
    0,
  );
  const score = totalChecks > 0
    ? Math.round((passedChecks / totalChecks) * 100 * 10) / 10
    : 0;

  return {
    score,
    passed: score >= 80,
    patternsFound: details.flatMap((result) => result.patternsFound),
    patternsMissing: details.flatMap((result) => result.patternsMissing),
    details,
  };
}

function checkChallenge02Architecture(projectDir) {
  const appDirectory = join(projectDir, 'app');
  const pagePath = join(appDirectory, 'page.tsx');
  const layoutPath = join(appDirectory, 'layout.tsx');
  const pageContent = existsSync(pagePath) ? readFileSync(pagePath, 'utf-8') : '';
  const layoutContent = existsSync(layoutPath) ? readFileSync(layoutPath, 'utf-8') : '';
  const sourceFiles = getAppSourceFiles(appDirectory);
  const clientFiles = sourceFiles.filter((file) => hasUseClientDirective(file.content));
  const interactiveClientFiles = clientFiles.filter((file) =>
    /\buseState\s*\(|\bon(?:Click|Change|Submit)\s*=/.test(file.content),
  );
  const renderedClientFiles = interactiveClientFiles.filter((file) =>
    isImportedAndRendered(pageContent, pagePath, file.path),
  );
  const clientFile = renderedClientFiles[0] || interactiveClientFiles[0] || clientFiles[0];
  const clientInteractionPattern = interactiveClientFiles.some((file) =>
    /\buseState\s*\(/.test(file.content),
  ) ? 'useState' : 'eventHandler';

  const clientPatternsFound = [];
  const clientPatternsMissing = [];
  (clientFiles.length > 0 ? clientPatternsFound : clientPatternsMissing).push('useClient');
  (interactiveClientFiles.length > 0
    ? clientPatternsFound
    : clientPatternsMissing).push(interactiveClientFiles.length > 0
      ? clientInteractionPattern
      : 'clientInteraction');

  const pagePatternsFound = [];
  const pagePatternsMissing = [];
  (existsSync(pagePath) && isServerComponent(pageContent)
    ? pagePatternsFound
    : pagePatternsMissing).push('serverComponent');
  (renderedClientFiles.length > 0
    ? pagePatternsFound
    : pagePatternsMissing).push('clientComponent');

  const layoutPatternsFound = [];
  const layoutPatternsMissing = [];
  (existsSync(layoutPath) && isServerComponent(layoutContent)
    ? layoutPatternsFound
    : layoutPatternsMissing).push('serverComponent');

  const details = [
    {
      file: clientFile?.file || 'app/components/Counter.tsx',
      patternsFound: clientPatternsFound,
      patternsMissing: clientPatternsMissing,
    },
    {
      file: 'app/page.tsx',
      patternsFound: pagePatternsFound,
      patternsMissing: pagePatternsMissing,
    },
    {
      file: 'app/layout.tsx',
      patternsFound: layoutPatternsFound,
      patternsMissing: layoutPatternsMissing,
    },
  ];
  const totalChecks = details.reduce(
    (total, result) => total + result.patternsFound.length + result.patternsMissing.length,
    0,
  );
  const passedChecks = details.reduce(
    (total, result) => total + result.patternsFound.length,
    0,
  );
  const score = totalChecks > 0
    ? Math.round((passedChecks / totalChecks) * 100 * 10) / 10
    : 0;

  return {
    score,
    passed: score >= 80,
    patternsFound: details.flatMap((result) => result.patternsFound),
    patternsMissing: details.flatMap((result) => result.patternsMissing),
    details,
  };
}

function checkChallenge03Architecture(challengeMetadata, projectDir) {
  const file = challengeMetadata.filesToCheck?.[0] || 'app/posts/page.tsx';
  const filePath = join(projectDir, file);
  const exists = existsSync(filePath);
  const patternsFound = [];
  const patternsMissing = [];

  if (exists) {
    const content = readFileSync(filePath, 'utf-8');

    try {
      const ast = parse(content, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx', 'decorators-legacy', 'classProperties'],
      });
      const defaultExport = ast.program.body.find(
        (node) => node.type === 'ExportDefaultDeclaration',
      );
      const component = getAsyncDefaultExport(ast.program, defaultExport);
      const usesClient = ast.program.directives?.some(
        (directive) => directive.value.value === 'use client',
      ) || false;
      let hasFetch = false;
      let hasAwait = false;

      if (component) {
        walkAst(component, (node) => {
          if (
            node.type === 'CallExpression' &&
            node.callee.type === 'Identifier' &&
            node.callee.name === 'fetch'
          ) {
            hasFetch = true;
          }
          if (node.type === 'AwaitExpression') {
            hasAwait = true;
          }
        });
      }

      const checks = [
        ['asyncServerComponent', Boolean(component) && !usesClient],
        ['fetch', hasFetch],
        ['await', hasAwait],
      ];
      for (const [pattern, found] of checks) {
        (found ? patternsFound : patternsMissing).push(pattern);
      }
    } catch {
      patternsMissing.push(...(challengeMetadata.patternsRequired || [
        'asyncServerComponent',
        'fetch',
        'await',
      ]));
    }
  } else {
    patternsMissing.push(...(challengeMetadata.patternsRequired || [
      'asyncServerComponent',
      'fetch',
      'await',
    ]));
  }

  const totalChecks = patternsFound.length + patternsMissing.length;
  const score = totalChecks > 0
    ? Math.round((patternsFound.length / totalChecks) * 100 * 10) / 10
    : 0;

  return {
    score,
    passed: score >= 80,
    patternsFound,
    patternsMissing,
    details: [{ file, patternsFound, patternsMissing }],
  };
}

function checkChallenge04Architecture(challengeMetadata, projectDir) {
  const configuredFile = challengeMetadata.filesToCheck?.[0] || 'app/api/posts/route.ts';
  const candidateFiles = [
    configuredFile,
    configuredFile.replace(/\.ts$/, '.js'),
  ];
  const file = candidateFiles.find((candidate) => existsSync(join(projectDir, candidate)));
  const patternsFound = [];
  const patternsMissing = [];

  if (!file) {
    patternsMissing.push('routeHandler', 'GET', 'ResponseJson');
  } else {
    const normalizedFile = file.replace(/\\/g, '/');
    const content = readFileSync(join(projectDir, file), 'utf-8');
    const isRouteFile = /^app\/api\/.+\/route\.(?:ts|js)$/.test(normalizedFile);
    let hasGetHandler = false;
    let hasJsonResponse = false;

    try {
      const ast = parse(content, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx', 'decorators-legacy', 'classProperties'],
      });

      hasGetHandler = ast.program.body.some((node) => {
        if (node.type !== 'ExportNamedDeclaration') return false;
        const declaration = node.declaration;
        if (declaration?.type === 'FunctionDeclaration' && declaration.id?.name === 'GET') {
          return true;
        }
        if (
          declaration?.type === 'VariableDeclaration' &&
          declaration.declarations.some((item) => item.id.type === 'Identifier' && item.id.name === 'GET')
        ) {
          return true;
        }
        return node.specifiers.some(
          (specifier) => (specifier.exported.name || specifier.exported.value) === 'GET',
        );
      });

      walkAst(ast.program, (node) => {
        if (node.type !== 'CallExpression' || node.callee.type !== 'MemberExpression') return;
        const objectName = node.callee.object.type === 'Identifier'
          ? node.callee.object.name
          : '';
        const propertyName = node.callee.property.type === 'Identifier'
          ? node.callee.property.name
          : node.callee.property.value;
        if (['Response', 'NextResponse'].includes(objectName) && propertyName === 'json') {
          hasJsonResponse = true;
        }
      });
    } catch {
      hasGetHandler = /export\s+(?:async\s+)?function\s+GET\b|export\s+(?:const|let|var)\s+GET\b/.test(content);
      hasJsonResponse = /(?:NextResponse|Response)\.json\s*\(/.test(content);
    }

    for (const [pattern, found] of [
      ['routeHandler', isRouteFile],
      ['GET', hasGetHandler],
      ['ResponseJson', hasJsonResponse],
    ]) {
      (found ? patternsFound : patternsMissing).push(pattern);
    }
  }

  const totalChecks = patternsFound.length + patternsMissing.length;
  const score = totalChecks > 0
    ? Math.round((patternsFound.length / totalChecks) * 100 * 10) / 10
    : 0;

  return {
    score,
    passed: score >= 80,
    patternsFound,
    patternsMissing,
    details: [{ file: file || configuredFile, patternsFound, patternsMissing }],
  };
}

function checkChallenge05Architecture(challengeMetadata, projectDir) {
  const file = challengeMetadata.filesToCheck?.find((candidate) =>
    /(^|\/)loading\.(?:tsx|jsx?)$/.test(candidate.replace(/\\/g, '/')),
  ) || 'app/posts/loading.tsx';
  const normalizedFile = file.replace(/\\/g, '/');
  const filePath = join(projectDir, file);
  const patternsFound = [];
  const patternsMissing = [];

  if (existsSync(filePath) && /^app\/posts\/loading\.(?:tsx|jsx?)$/.test(normalizedFile)) {
    const content = readFileSync(filePath, 'utf-8');
    let hasDefaultExport = false;
    try {
      const ast = parse(content, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx', 'decorators-legacy', 'classProperties'],
      });
      hasDefaultExport = ast.program.body.some((node) =>
        node.type === 'ExportDefaultDeclaration',
      );
    } catch {
      hasDefaultExport = /export\s+default\b/.test(content);
    }

    for (const [pattern, found] of [
      ['loadingTsx', hasDefaultExport],
      ['loadingUI', /return\s*\(?\s*</.test(content) && /loading|skeleton|spinner/i.test(content)],
    ]) {
      (found ? patternsFound : patternsMissing).push(pattern);
    }
  } else {
    patternsMissing.push('loadingTsx', 'loadingUI');
  }

  const totalChecks = patternsFound.length + patternsMissing.length;
  const score = totalChecks > 0
    ? Math.round((patternsFound.length / totalChecks) * 100 * 10) / 10
    : 0;

  return {
    score,
    passed: score >= 80,
    patternsFound,
    patternsMissing,
    details: [{ file: normalizedFile, patternsFound, patternsMissing }],
  };
}

function checkChallenge06Architecture(challengeMetadata, projectDir) {
  const supportedFiles = [
    'app/posts/[id]/page.tsx',
    'app/posts/[slug]/page.tsx',
    'app/blog/[id]/page.tsx',
  ];
  const configuredFiles = challengeMetadata.filesToCheck || [];
  const file = [...configuredFiles, ...supportedFiles].find((candidate) =>
    supportedFiles.includes(candidate.replace(/\\/g, '/')) && existsSync(join(projectDir, candidate)),
  ) || configuredFiles[0] || supportedFiles[0];
  const normalizedFile = file.replace(/\\/g, '/');
  const patternsFound = [];
  const patternsMissing = [];

  if (supportedFiles.includes(normalizedFile) && existsSync(join(projectDir, file))) {
    const content = readFileSync(join(projectDir, file), 'utf-8');
    let hasDefaultExport = false;
    let usesRouteParam = false;

    try {
      const ast = parse(content, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx', 'decorators-legacy', 'classProperties'],
      });
      hasDefaultExport = ast.program.body.some((node) =>
        node.type === 'ExportDefaultDeclaration',
      );
      walkAst(ast.program, (node) => {
        if (
          node.type === 'MemberExpression' &&
          node.object.type === 'Identifier' &&
          node.object.name === 'params' &&
          node.property.type === 'Identifier' &&
          ['id', 'slug'].includes(node.property.name)
        ) {
          usesRouteParam = true;
        }
      });
    } catch {
      hasDefaultExport = /export\s+default\b/.test(content);
      usesRouteParam = /\bparams\s*\.\s*(?:id|slug)\b/.test(content);
    }

    for (const [pattern, found] of [
      ['dynamicSegment', hasDefaultExport],
      ['params', usesRouteParam],
    ]) {
      (found ? patternsFound : patternsMissing).push(pattern);
    }
  } else {
    patternsMissing.push('dynamicSegment', 'params');
  }

  const totalChecks = patternsFound.length + patternsMissing.length;
  const score = totalChecks > 0
    ? Math.round((patternsFound.length / totalChecks) * 100 * 10) / 10
    : 0;

  return {
    score,
    passed: score >= 80,
    patternsFound,
    patternsMissing,
    details: [{ file: normalizedFile, patternsFound, patternsMissing }],
  };
}

function checkChallenge07Architecture(challengeMetadata, projectDir) {
  const files = challengeMetadata.filesToCheck || ['app/page.tsx', 'app/posts/page.tsx'];
  const qualifyingFile = files.find((file) => {
    const filePath = join(projectDir, file);
    if (!existsSync(filePath)) return false;
    const content = readFileSync(filePath, 'utf-8');
    return /export\s+const\s+dynamic\s*=\s*['"]force-(?:static|dynamic)['"]|\b(?:force-static|force-dynamic)\b|\b(?:headers|cookies)\s*\(\)|\bsearchParams\b/.test(content);
  });
  const patternsFound = qualifyingFile ? ['dynamicExport', 'forceStaticOrDynamic'] : [];
  const patternsMissing = qualifyingFile ? [] : ['dynamicExport', 'forceStaticOrDynamic'];
  const score = qualifyingFile ? 100 : 0;

  return {
    score,
    passed: score >= 80,
    patternsFound,
    patternsMissing,
    details: [{
      file: qualifyingFile || files.join(', '),
      patternsFound,
      patternsMissing,
    }],
  };
}

function checkChallenge08Architecture(challengeMetadata, projectDir) {
  const files = challengeMetadata.filesToCheck || ['app/posts/page.tsx', 'app/dashboard/page.tsx'];
  const availableFiles = files.filter((file) => existsSync(join(projectDir, file)));
  const checks = availableFiles.map((file) => {
    const content = readFileSync(join(projectDir, file), 'utf-8');
    let hasAsyncDefaultPage = false;

    try {
      const ast = parse(content, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx', 'decorators-legacy', 'classProperties'],
      });
      const defaultExport = ast.program.body.find(
        (node) => node.type === 'ExportDefaultDeclaration',
      );
      hasAsyncDefaultPage = Boolean(getAsyncDefaultExport(ast.program, defaultExport));
    } catch {
      hasAsyncDefaultPage = /export\s+default\s+async\s+function\b|export\s+default\s+async\s*\(/.test(content);
    }

    const usesForceDynamic = /export\s+const\s+dynamic\s*=\s*['"]force-dynamic['"]/.test(content);
    const usesNoStoreFetch = /fetch\s*\([\s\S]*?\{[^}]*\bcache\s*:\s*['"]no-store['"][^}]*\}/.test(content);
    const fetchesOnServer = hasAsyncDefaultPage && /\bfetch\s*\(/.test(content);
    const rendersFetchedData = /\.map\s*\(/.test(content) && /\{\s*(?:post|item|data)\.(?:title|body|name|id)\s*\}/.test(content);

    return {
      file,
      usesSsrStrategy: usesForceDynamic || usesNoStoreFetch,
      usesForceDynamic,
      usesNoStoreFetch,
      fetchesOnServer,
      rendersFetchedData,
    };
  });

  const qualifyingPage = checks.find((check) =>
    check.usesSsrStrategy && check.fetchesOnServer && check.rendersFetchedData,
  );
  const patternsFound = [];
  const patternsMissing = [];
  const ssrStrategy = checks.some((check) => check.usesForceDynamic)
    ? 'forceDynamic'
    : checks.some((check) => check.usesNoStoreFetch)
      ? 'cacheNoStore'
      : null;

  (ssrStrategy ? patternsFound : patternsMissing).push(ssrStrategy || 'forceDynamicOrCacheNoStore');
  (qualifyingPage ? patternsFound : patternsMissing).push('serverFetchAndRenderedData');

  const totalChecks = patternsFound.length + patternsMissing.length;
  const score = totalChecks > 0
    ? Math.round((patternsFound.length / totalChecks) * 100 * 10) / 10
    : 0;

  return {
    score,
    passed: score >= 80,
    patternsFound,
    patternsMissing,
    details: checks.length > 0
      ? checks.map((check) => ({
        file: check.file,
        patternsFound: [
          ...(check.usesForceDynamic ? ['forceDynamic'] : []),
          ...(check.usesNoStoreFetch ? ['cacheNoStore'] : []),
          ...(check.fetchesOnServer ? ['serverFetch'] : []),
          ...(check.rendersFetchedData ? ['renderedData'] : []),
        ],
        patternsMissing: [],
      }))
      : [{ file: files.join(', '), patternsFound: [], patternsMissing }],
  };
}

function checkChallenge09Architecture(challengeMetadata, projectDir) {
  const configuredFiles = challengeMetadata.filesToCheck || [];
  const actionFile = ['app/actions.ts', 'app/actions.js'].find((file) =>
    existsSync(join(projectDir, file)),
  );
  const formFile = configuredFiles.find((file) =>
    /AddPostForm\.(?:tsx|jsx?)$/.test(file) && existsSync(join(projectDir, file)),
  ) || 'app/components/AddPostForm.tsx';
  const postsFile = configuredFiles.find((file) =>
    /(?:^|\/)posts\/page\.(?:tsx|jsx?)$/.test(file) && existsSync(join(projectDir, file)),
  ) || 'app/posts/page.tsx';
  const actionContent = actionFile
    ? readFileSync(join(projectDir, actionFile), 'utf-8')
    : '';
  const formContent = existsSync(join(projectDir, formFile))
    ? readFileSync(join(projectDir, formFile), 'utf-8')
    : '';
  const postsContent = existsSync(join(projectDir, postsFile))
    ? readFileSync(join(projectDir, postsFile), 'utf-8')
    : '';
  const usesServerDirective = /^\s*['"]use server['"]\s*;?/.test(actionContent);
  const hasAsyncAction = /export\s+async\s+function\s+\w+\s*\(/.test(actionContent) ||
    /export\s+const\s+\w+\s*=\s*async\s*\(/.test(actionContent);
  const revalidationPattern = /\brevalidate(?:Path|Tag)\s*\(/.test(actionContent);
  const hasClientForm = /^\s*['"]use client['"]\s*;?/.test(formContent) &&
    /<form\b[^>]*\bonSubmit\s*=/.test(formContent);
  const invokesServerAction = /import\s*\{[^}]*\bcreatePost\b[^}]*\}\s*from\s*['"][^'"]*actions['"]/.test(formContent) &&
    /\bcreatePost\s*\(/.test(formContent);
  const importsAndRendersForm = /import\s+AddPostForm\s+from\s+['"][^'"]*AddPostForm['"]/.test(postsContent) &&
    /<AddPostForm\s*\/?\s*>/.test(postsContent);

  const details = [
    {
      file: actionFile || 'app/actions.ts',
      patternsFound: [
        ...(usesServerDirective ? ['useServer'] : []),
        ...(hasAsyncAction ? ['serverAction'] : []),
        ...(revalidationPattern ? ['revalidatePathOrTag'] : []),
      ],
      patternsMissing: [
        ...(!usesServerDirective ? ['useServer'] : []),
        ...(!hasAsyncAction ? ['serverAction'] : []),
        ...(!revalidationPattern ? ['revalidatePathOrTag'] : []),
      ],
    },
    {
      file: formFile,
      patternsFound: [
        ...(hasClientForm ? ['clientFormAction'] : []),
        ...(invokesServerAction ? ['serverActionInvocation'] : []),
        ...(importsAndRendersForm ? ['formRenderedOnPostsPage'] : []),
      ],
      patternsMissing: [
        ...(!hasClientForm ? ['clientFormAction'] : []),
        ...(!invokesServerAction ? ['serverActionInvocation'] : []),
        ...(!importsAndRendersForm ? ['formRenderedOnPostsPage'] : []),
      ],
    },
  ];
  const totalChecks = details.reduce(
    (total, result) => total + result.patternsFound.length + result.patternsMissing.length,
    0,
  );
  const passedChecks = details.reduce(
    (total, result) => total + result.patternsFound.length,
    0,
  );
  const score = totalChecks > 0
    ? Math.round((passedChecks / totalChecks) * 100 * 10) / 10
    : 0;

  return {
    score,
    passed: score >= 80,
    patternsFound: details.flatMap((result) => result.patternsFound),
    patternsMissing: details.flatMap((result) => result.patternsMissing),
    details,
  };
}

function checkChallenge10Architecture(challengeMetadata, projectDir) {
  const files = challengeMetadata.filesToCheck || ['app/posts/page.tsx', 'app/actions.ts'];
  const details = files.filter((file) => existsSync(join(projectDir, file))).map((file) => {
    const content = readFileSync(join(projectDir, file), 'utf-8');
    const isPostsPage = /(?:^|\/)posts\/page\.(?:tsx|jsx?)$/.test(file.replace(/\\/g, '/'));
    const isActionsFile = /(?:^|\/)actions\.(?:ts|js)$/.test(file.replace(/\\/g, '/'));
    const hasCachedFetch = isPostsPage &&
      /\bfetch\s*\([\s\S]*?(?:next\s*:\s*\{[^}]*\brevalidate\s*:\s*\d+|cache\s*:\s*['"]force-cache['"])/.test(content);
    const hasOnDemandRevalidation = isActionsFile &&
      /\brevalidate(?:Path|Tag)\s*\(/.test(content);

    return {
      file,
      patternsFound: [
        ...(hasCachedFetch ? ['fetchCache'] : []),
        ...(hasOnDemandRevalidation ? ['revalidate'] : []),
      ],
      patternsMissing: [],
    };
  });
  const hasAcceptedStrategy = details.some((result) => result.patternsFound.length > 0);

  if (!hasAcceptedStrategy) {
    details.push({
      file: files.join(' or '),
      patternsFound: [],
      patternsMissing: ['fetchCacheOrRevalidate'],
    });
  }

  const score = hasAcceptedStrategy ? 100 : 0;
  const patternsFound = details.flatMap((result) => result.patternsFound);
  const patternsMissing = hasAcceptedStrategy
    ? []
    : ['fetchCacheOrRevalidate'];

  return {
    score,
    passed: score >= 80,
    patternsFound,
    patternsMissing,
    details,
  };
}

function checkChallenge11Architecture(projectDir) {
  const errorFiles = ['app/error.tsx', 'app/posts/error.tsx'];
  const errorFile = errorFiles.find((file) => existsSync(join(projectDir, file)));
  const errorContent = errorFile
    ? readFileSync(join(projectDir, errorFile), 'utf-8')
    : '';
  const postPageFile = 'app/posts/[id]/page.tsx';
  const postPagePath = join(projectDir, postPageFile);
  const postPageContent = existsSync(postPagePath)
    ? readFileSync(postPagePath, 'utf-8')
    : '';
  const hasClientErrorBoundary = /^\s*['"]use client['"]\s*;?/.test(errorContent) &&
    /export\s+default\s+function\s+\w+\s*\(\s*\{[^}]*\berror\b[^}]*\breset\b|export\s+default\s+function\s+\w+\s*\(\s*\{[^}]*\breset\b[^}]*\berror\b/.test(errorContent);
  const importsNotFound = /import\s*\{[^}]*\bnotFound\b[^}]*\}\s*from\s*['"]next\/navigation['"]/.test(postPageContent);
  const callsNotFound = /\bnotFound\s*\(/.test(postPageContent);
  const details = [
    {
      file: errorFile || errorFiles.join(' or '),
      patternsFound: [
        ...(errorFile ? ['errorTsx'] : []),
        ...(hasClientErrorBoundary ? ['clientErrorBoundary'] : []),
      ],
      patternsMissing: [
        ...(!errorFile ? ['errorTsx'] : []),
        ...(!hasClientErrorBoundary ? ['clientErrorBoundary'] : []),
      ],
    },
    {
      file: postPageFile,
      patternsFound: [
        ...(importsNotFound && callsNotFound ? ['notFound'] : []),
      ],
      patternsMissing: [
        ...(!(importsNotFound && callsNotFound) ? ['notFound'] : []),
      ],
    },
  ];
  const totalChecks = details.reduce(
    (total, result) => total + result.patternsFound.length + result.patternsMissing.length,
    0,
  );
  const passedChecks = details.reduce(
    (total, result) => total + result.patternsFound.length,
    0,
  );
  const score = totalChecks > 0
    ? Math.round((passedChecks / totalChecks) * 100 * 10) / 10
    : 0;

  return {
    score,
    passed: score >= 80,
    patternsFound: details.flatMap((result) => result.patternsFound),
    patternsMissing: details.flatMap((result) => result.patternsMissing),
    details,
  };
}

function checkChallenge12Architecture(challengeMetadata, projectDir) {
  const files = challengeMetadata.filesToCheck || [
    'app/layout.tsx',
    'app/page.tsx',
    'app/posts/page.tsx',
  ];
  const details = files.filter((file) => existsSync(join(projectDir, file))).map((file) => {
    const content = readFileSync(join(projectDir, file), 'utf-8');
    let hasStaticMetadata = false;
    let hasDynamicMetadata = false;
    let hasTitleAndDescription = false;

    try {
      const ast = parse(content, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx', 'decorators-legacy', 'classProperties'],
      });
      const propertyNames = (object) => object?.type === 'ObjectExpression'
        ? object.properties.map((property) => {
          if (property.type !== 'ObjectProperty') return '';
          return property.key.type === 'Identifier'
            ? property.key.name
            : property.key.value;
        })
        : [];

      for (const statement of ast.program.body) {
        if (statement.type !== 'ExportNamedDeclaration') continue;
        const declaration = statement.declaration;
        if (declaration?.type === 'VariableDeclaration') {
          for (const item of declaration.declarations) {
            if (item.id.type !== 'Identifier') continue;
            const keys = propertyNames(item.init);
            if (item.id.name === 'metadata') {
              hasStaticMetadata = true;
              if (keys.includes('title') && keys.includes('description')) {
                hasTitleAndDescription = true;
              }
            }
            if (item.id.name === 'generateMetadata') {
              hasDynamicMetadata = true;
              walkAst(item.init, (node) => {
                if (node.type === 'ReturnStatement') {
                  const returnKeys = propertyNames(node.argument);
                  if (returnKeys.includes('title') && returnKeys.includes('description')) {
                    hasTitleAndDescription = true;
                  }
                }
              });
            }
          }
        } else if (
          declaration?.type === 'FunctionDeclaration' &&
          declaration.id?.name === 'generateMetadata'
        ) {
          hasDynamicMetadata = true;
          walkAst(declaration.body, (node) => {
            if (node.type === 'ReturnStatement') {
              const returnKeys = propertyNames(node.argument);
              if (returnKeys.includes('title') && returnKeys.includes('description')) {
                hasTitleAndDescription = true;
              }
            }
          });
        }
      }
    } catch {
      hasStaticMetadata = /export\s+const\s+metadata\b/.test(content);
      hasDynamicMetadata = /export\s+(?:async\s+)?function\s+generateMetadata\b|export\s+const\s+generateMetadata\b/.test(content);
      hasTitleAndDescription = /\btitle\s*:/.test(content) && /\bdescription\s*:/.test(content);
    }

    const hasMetadataExport = hasStaticMetadata || hasDynamicMetadata;
    return {
      file,
      patternsFound: [
        ...(hasMetadataExport ? ['metadataOrGenerateMetadata'] : []),
        ...(hasMetadataExport && hasTitleAndDescription ? ['titleAndDescription'] : []),
      ],
      patternsMissing: [
        ...(!hasMetadataExport ? ['metadataOrGenerateMetadata'] : []),
        ...(!(hasMetadataExport && hasTitleAndDescription) ? ['titleAndDescription'] : []),
      ],
    };
  });
  const hasQualifyingMetadata = details.some((result) =>
    result.patternsFound.includes('metadataOrGenerateMetadata') &&
    result.patternsFound.includes('titleAndDescription'),
  );

  if (!hasQualifyingMetadata && details.length === 0) {
    details.push({
      file: files.join(', '),
      patternsFound: [],
      patternsMissing: ['metadataOrGenerateMetadata', 'titleAndDescription'],
    });
  }

  const patternsFound = hasQualifyingMetadata
    ? ['metadataOrGenerateMetadata', 'titleAndDescription']
    : [];
  const patternsMissing = hasQualifyingMetadata
    ? []
    : ['metadataOrGenerateMetadata', 'titleAndDescription'];
  const score = hasQualifyingMetadata ? 100 : 0;

  return {
    score,
    passed: score >= 80,
    patternsFound,
    patternsMissing,
    details,
  };
}

function checkChallenge13Architecture(challengeMetadata, projectDir) {
  const pageFile = 'app/page.tsx';
  const layoutFile = 'app/layout.tsx';
  const pagePath = join(projectDir, pageFile);
  const layoutPath = join(projectDir, layoutFile);
  const pageContent = existsSync(pagePath) ? readFileSync(pagePath, 'utf-8') : '';
  const layoutContent = existsSync(layoutPath) ? readFileSync(layoutPath, 'utf-8') : '';
  const importsNextImage = /import\s+Image\s+from\s+['"]next\/image['"]/.test(pageContent);
  const rendersSizedImage = /<Image\b(?=[^>]*\bsrc\s*=)(?=[^>]*\balt\s*=)(?=[^>]*(?:\bwidth\s*=|\bfill\b))[^>]*\/?\s*>/.test(pageContent);
  const importsNextFont = /from\s+['"]next\/font(?:\/[^'"]+)?['"]/.test(layoutContent);
  const appliesFontClass = /<(?:body|[A-Za-z][\w.]*)\b[^>]*\bclassName\s*=\s*\{[^}]*\.className\s*\}/.test(layoutContent);
  const details = [
    {
      file: pageFile,
      patternsFound: [
        ...(importsNextImage ? ['nextImageImport'] : []),
        ...(importsNextImage && rendersSizedImage ? ['optimizedImageWithAltAndDimensions'] : []),
      ],
      patternsMissing: [
        ...(!importsNextImage ? ['nextImageImport'] : []),
        ...(!(importsNextImage && rendersSizedImage) ? ['optimizedImageWithAltAndDimensions'] : []),
      ],
    },
    {
      file: layoutFile,
      patternsFound: [
        ...(importsNextFont ? ['nextFontImport'] : []),
        ...(importsNextFont && appliesFontClass ? ['fontAppliedToLayout'] : []),
      ],
      patternsMissing: [
        ...(!importsNextFont ? ['nextFontImport'] : []),
        ...(!(importsNextFont && appliesFontClass) ? ['fontAppliedToLayout'] : []),
      ],
    },
  ];
  const totalChecks = details.reduce(
    (total, result) => total + result.patternsFound.length + result.patternsMissing.length,
    0,
  );
  const passedChecks = details.reduce(
    (total, result) => total + result.patternsFound.length,
    0,
  );
  const score = totalChecks > 0
    ? Math.round((passedChecks / totalChecks) * 100 * 10) / 10
    : 0;

  return {
    score,
    passed: score >= 80,
    patternsFound: details.flatMap((result) => result.patternsFound),
    patternsMissing: details.flatMap((result) => result.patternsMissing),
    details,
  };
}

function checkChallenge14Architecture(challengeMetadata, projectDir) {
  const file = challengeMetadata.filesToCheck?.[0] || 'app/posts/page.tsx';
  const filePath = join(projectDir, file);
  const exists = existsSync(filePath);
  const content = exists ? readFileSync(filePath, 'utf-8') : '';
  const readsSearchParams = /\bsearchParams\b/.test(content) &&
    /searchParams\s*\.\s*q\b/.test(content) &&
    /searchParams\s*\.\s*page\b/.test(content);
  const filtersBySearchQuery = /\.filter\s*\(/.test(content) &&
    /\.includes\s*\(/.test(content) &&
    /normalizedQuery|query/.test(content);
  const slicesPageResults = /\.slice\s*\(/.test(content) &&
    /pageSize/.test(content) &&
    /currentPage|pageStart/.test(content);
  const providesPageNavigation = /import\s+Link\s+from\s+['"]next\/link['"]/.test(content) &&
    /<Link\b[^>]*\bhref\s*=/.test(content) &&
    /Previous|Next/.test(content);
  const hasPagination = slicesPageResults && providesPageNavigation;
  const details = [{
    file,
    patternsFound: [
      ...(readsSearchParams ? ['searchParams'] : []),
      ...(filtersBySearchQuery ? ['searchFiltering'] : []),
      ...(hasPagination ? ['pagination'] : []),
    ],
    patternsMissing: [
      ...(!readsSearchParams ? ['searchParams'] : []),
      ...(!filtersBySearchQuery ? ['searchFiltering'] : []),
      ...(!hasPagination ? ['pagination'] : []),
    ],
  }];
  const totalChecks = details[0].patternsFound.length + details[0].patternsMissing.length;
  const score = totalChecks > 0
    ? Math.round((details[0].patternsFound.length / totalChecks) * 100 * 10) / 10
    : 0;

  return {
    score,
    passed: score >= 80,
    patternsFound: details[0].patternsFound,
    patternsMissing: details[0].patternsMissing,
    details,
  };
}

function checkChallenge15Architecture(projectDir) {
  const storeFile = 'app/store/store.ts';
  const providerFile = 'app/providers/StoreProvider.tsx';
  const layoutFile = 'app/layout.tsx';
  const candidateHookFiles = [
    'app/providers/StoreProvider.tsx',
    'app/page.tsx',
    'app/components/Counter.tsx',
  ];
  const readFile = (file) => existsSync(join(projectDir, file))
    ? readFileSync(join(projectDir, file), 'utf-8')
    : '';
  const storeContent = readFile(storeFile);
  const providerContent = readFile(providerFile);
  const layoutContent = readFile(layoutFile);
  const hasToolkitStore = /from\s+['"]@reduxjs\/toolkit['"]/.test(storeContent) &&
    /\bconfigureStore\s*\(/.test(storeContent) &&
    /\bcreateSlice\s*\(/.test(storeContent);
  const exportsStoreTypes = /export\s+(?:const|let|var)\s+store\b/.test(storeContent) &&
    /export\s+type\s+RootState\b/.test(storeContent) &&
    /export\s+type\s+AppDispatch\b/.test(storeContent);
  const hasClientProvider = /^\s*['"]use client['"]\s*;?/.test(providerContent) &&
    /import\s+\{[^}]*\bProvider\b[^}]*\}\s+from\s+['"]react-redux['"]/.test(providerContent) &&
    /<Provider\b[^>]*\bstore\s*=/.test(providerContent);
  const layoutUsesProvider = /import\s+StoreProvider\s+from\s+['"][^'"]*StoreProvider['"]/.test(layoutContent) &&
    /<StoreProvider\b[^>]*>\s*\{children\}\s*<\/StoreProvider>/.test(layoutContent);
  const hookFile = candidateHookFiles.find((file) => {
    const content = readFile(file);
    return /^\s*['"]use client['"]\s*;?/.test(content) &&
      /\buse(?:Selector|Dispatch)\s*</.test(content) &&
      /from\s+['"]react-redux['"]/.test(content);
  });
  const details = [
    {
      file: storeFile,
      patternsFound: [
        ...(hasToolkitStore ? ['configureStore'] : []),
        ...(exportsStoreTypes ? ['storeAndTypes'] : []),
      ],
      patternsMissing: [
        ...(!hasToolkitStore ? ['configureStore'] : []),
        ...(!exportsStoreTypes ? ['storeAndTypes'] : []),
      ],
    },
    {
      file: providerFile,
      patternsFound: hasClientProvider ? ['clientProvider'] : [],
      patternsMissing: hasClientProvider ? [] : ['clientProvider'],
    },
    {
      file: layoutFile,
      patternsFound: layoutUsesProvider ? ['layoutUsesProvider'] : [],
      patternsMissing: layoutUsesProvider ? [] : ['layoutUsesProvider'],
    },
    {
      file: hookFile || candidateHookFiles.join(' or '),
      patternsFound: hookFile ? ['clientReduxHooks'] : [],
      patternsMissing: hookFile ? [] : ['clientReduxHooks'],
    },
  ];
  const totalChecks = details.reduce(
    (total, result) => total + result.patternsFound.length + result.patternsMissing.length,
    0,
  );
  const passedChecks = details.reduce(
    (total, result) => total + result.patternsFound.length,
    0,
  );
  const score = totalChecks > 0
    ? Math.round((passedChecks / totalChecks) * 100 * 10) / 10
    : 0;

  return {
    score,
    passed: score >= 80,
    patternsFound: details.flatMap((result) => result.patternsFound),
    patternsMissing: details.flatMap((result) => result.patternsMissing),
    details,
  };
}

function checkChallenge16Architecture(projectDir) {
  const apiSliceFile = 'app/store/apiSlice.ts';
  const storeFile = 'app/store/store.ts';
  const componentFiles = [
    'app/posts/PostsList.tsx',
    'app/components/PostsList.tsx',
    'app/posts/page.tsx',
  ];
  const readFile = (file) => existsSync(join(projectDir, file))
    ? readFileSync(join(projectDir, file), 'utf-8')
    : '';
  const apiSliceContent = readFile(apiSliceFile);
  const storeContent = readFile(storeFile);
  const apiImports = /import\s*\{[^}]*\bcreateApi\b[^}]*\bfetchBaseQuery\b[^}]*\}\s*from\s*['"]@reduxjs\/toolkit\/query(?:\/react)?['"]/.test(apiSliceContent) ||
    /import\s*\{[^}]*\bfetchBaseQuery\b[^}]*\bcreateApi\b[^}]*\}\s*from\s*['"]@reduxjs\/toolkit\/query(?:\/react)?['"]/.test(apiSliceContent);
  const definesApi = apiImports && /\bcreateApi\s*\(/.test(apiSliceContent) &&
    /\bfetchBaseQuery\s*\(/.test(apiSliceContent);
  const exportsGeneratedQueryHook = /export\s+const\s*\{[^}]*\buse\w+Query\b[^}]*\}\s*=\s*\w+Api\b/.test(apiSliceContent);
  const importsApiInStore = /import\s*\{[^}]+\}\s*from\s*['"][^'"]*apiSlice['"]/.test(storeContent);
  const registersApiReducer = importsApiInStore && /\[\w+Api\.reducerPath\]\s*:\s*\w+Api\.reducer/.test(storeContent);
  const registersApiMiddleware = importsApiInStore && /\.concat\s*\(\s*\w+Api\.middleware\s*\)/.test(storeContent);
  const hookFile = componentFiles.find((file) => {
    const content = readFile(file);
    return /^\s*['"]use client['"]\s*;?/.test(content) &&
      /import\s*\{[^}]*\buse\w+Query\b[^}]*\}\s*from\s*['"][^'"]*apiSlice['"]/.test(content) &&
      /\buse\w+Query\s*\(/.test(content);
  });
  const hookContent = hookFile ? readFile(hookFile) : '';
  const handlesQueryStates = /\bisLoading\b/.test(hookContent) &&
    /\bisError\b/.test(hookContent);
  const details = [
    {
      file: apiSliceFile,
      patternsFound: [
        ...(definesApi ? ['createApiAndFetchBaseQuery'] : []),
        ...(exportsGeneratedQueryHook ? ['generatedQueryHook'] : []),
      ],
      patternsMissing: [
        ...(!definesApi ? ['createApiAndFetchBaseQuery'] : []),
        ...(!exportsGeneratedQueryHook ? ['generatedQueryHook'] : []),
      ],
    },
    {
      file: storeFile,
      patternsFound: [
        ...(registersApiReducer ? ['apiReducer'] : []),
        ...(registersApiMiddleware ? ['apiMiddleware'] : []),
      ],
      patternsMissing: [
        ...(!registersApiReducer ? ['apiReducer'] : []),
        ...(!registersApiMiddleware ? ['apiMiddleware'] : []),
      ],
    },
    {
      file: hookFile || componentFiles.join(' or '),
      patternsFound: [
        ...(hookFile ? ['clientGeneratedQueryHook'] : []),
        ...(hookFile && handlesQueryStates ? ['loadingAndErrorStates'] : []),
      ],
      patternsMissing: [
        ...(!hookFile ? ['clientGeneratedQueryHook'] : []),
        ...(!(hookFile && handlesQueryStates) ? ['loadingAndErrorStates'] : []),
      ],
    },
  ];
  const totalChecks = details.reduce(
    (total, result) => total + result.patternsFound.length + result.patternsMissing.length,
    0,
  );
  const passedChecks = details.reduce(
    (total, result) => total + result.patternsFound.length,
    0,
  );
  const score = totalChecks > 0
    ? Math.round((passedChecks / totalChecks) * 100 * 10) / 10
    : 0;

  return {
    score,
    passed: score >= 80,
    patternsFound: details.flatMap((result) => result.patternsFound),
    patternsMissing: details.flatMap((result) => result.patternsMissing),
    details,
  };
}

function checkChallenge17Architecture(projectDir) {
  const pageFile = 'app/posts/[id]/page.tsx';
  const pagePath = join(projectDir, pageFile);
  const pageContent = existsSync(pagePath)
    ? readFileSync(pagePath, 'utf-8')
    : '';
  const dynamicData = Boolean(pageContent) &&
    /params\s*\.\s*id\b/.test(pageContent) &&
    /\bfetch\s*\(/.test(pageContent);
  const importsNotFound = /import\s*\{[^}]*\bnotFound\b[^}]*\}\s*from\s*['"]next\/navigation['"]/.test(pageContent);
  const callsNotFound = /\bnotFound\s*\(/.test(pageContent);
  const errorFile = ['app/error.tsx', 'app/posts/error.tsx'].find((file) =>
    existsSync(join(projectDir, file)),
  );
  const errorContent = errorFile
    ? readFileSync(join(projectDir, errorFile), 'utf-8')
    : '';
  const hasErrorBoundary = Boolean(errorFile) &&
    /^\s*['"]use client['"]\s*;?/.test(errorContent) &&
    /\berror\b/.test(errorContent) &&
    /\breset\b/.test(errorContent);
  const errorHandling = (importsNotFound && callsNotFound) || hasErrorBoundary;

  let hasMetadata = false;
  if (pageContent) {
    try {
      const ast = parse(pageContent, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx', 'decorators-legacy', 'classProperties'],
      });
      for (const statement of ast.program.body) {
        if (statement.type !== 'ExportNamedDeclaration') continue;
        const declaration = statement.declaration;
        if (
          declaration?.type === 'FunctionDeclaration' &&
          declaration.id?.name === 'generateMetadata'
        ) {
          walkAst(declaration.body, (node) => {
            if (node.type !== 'ReturnStatement' || node.argument?.type !== 'ObjectExpression') return;
            const keys = node.argument.properties
              .filter((property) => property.type === 'ObjectProperty')
              .map((property) => property.key.type === 'Identifier'
                ? property.key.name
                : property.key.value);
            if (keys.includes('title') && keys.includes('description')) {
              hasMetadata = true;
            }
          });
        }
        if (declaration?.type === 'VariableDeclaration') {
          hasMetadata ||= declaration.declarations.some((item) => {
            if (item.id.type !== 'Identifier' || item.id.name !== 'metadata' || item.init?.type !== 'ObjectExpression') {
              return false;
            }
            const keys = item.init.properties
              .filter((property) => property.type === 'ObjectProperty')
              .map((property) => property.key.type === 'Identifier'
                ? property.key.name
                : property.key.value);
            return keys.includes('title') && keys.includes('description');
          });
        }
      }
    } catch {
      hasMetadata = /export\s+(?:async\s+)?function\s+generateMetadata\b|export\s+const\s+metadata\b/.test(pageContent) &&
        /\btitle\s*:/.test(pageContent) &&
        /\bdescription\s*:/.test(pageContent);
    }
  }

  const clientImport = pageContent.match(
    /import\s+([A-Z][\w$]*)\s+from\s+['"]\.\/([^'"]+)['"]\s*;?\s*/,
  );
  const clientName = clientImport?.[1];
  const clientBasePath = clientImport
    ? join(projectDir, 'app/posts/[id]', clientImport[2])
    : '';
  const clientFile = clientBasePath && ['.tsx', '.jsx', '.ts', '.js']
    .map((extension) => `${clientBasePath}${extension}`)
    .find((filePath) => existsSync(filePath));
  const clientContent = clientFile ? readFileSync(clientFile, 'utf-8') : '';
  const rendersClientComponent = Boolean(clientName) &&
    new RegExp(`<${clientName}(?:\\s|/|>)`).test(pageContent);
  const hasClientInteraction = Boolean(clientFile) &&
    /^\s*['"]use client['"]\s*;?/.test(clientContent) &&
    /\buse(?:State|Reducer)\s*\(/.test(clientContent) &&
    rendersClientComponent;

  const checks = [
    ['dynamicRouteData', dynamicData],
    ['clientInteraction', hasClientInteraction],
    ['errorHandling', errorHandling],
    ['metadata', hasMetadata],
  ];
  const patternsFound = [];
  const patternsMissing = [];
  for (const [pattern, found] of checks) {
    (found ? patternsFound : patternsMissing).push(pattern);
  }
  const score = Math.round((patternsFound.length / checks.length) * 100 * 10) / 10;

  return {
    score,
    passed: score >= 80,
    patternsFound,
    patternsMissing,
    details: [{ file: pageFile, patternsFound, patternsMissing }],
  };
}

function getAsyncDefaultExport(program, defaultExport) {
  if (!defaultExport) return null;

  const declaration = defaultExport.declaration;
  if (
    (declaration.type === 'FunctionDeclaration' ||
      declaration.type === 'FunctionExpression' ||
      declaration.type === 'ArrowFunctionExpression') &&
    declaration.async
  ) {
    return declaration;
  }

  if (declaration.type === 'Identifier') {
    const variable = program.body.find(
      (node) => node.type === 'VariableDeclaration' &&
        node.declarations.some((item) => item.id.name === declaration.name),
    );
    const initializer = variable?.declarations.find(
      (item) => item.id.name === declaration.name,
    )?.init;
    if (
      (initializer?.type === 'FunctionExpression' ||
        initializer?.type === 'ArrowFunctionExpression') &&
      initializer.async
    ) {
      return initializer;
    }
  }

  return null;
}

function walkAst(node, visit) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    node.forEach((child) => walkAst(child, visit));
    return;
  }

  if (typeof node.type === 'string') visit(node);
  for (const [key, value] of Object.entries(node)) {
    if (key !== 'loc' && key !== 'comments' && key !== 'tokens') {
      walkAst(value, visit);
    }
  }
}

function getAppSourceFiles(directory, relativeDirectory = 'app') {
  if (!existsSync(directory)) return [];

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(directory, entry.name);
    const relativePath = `${relativeDirectory}/${entry.name}`;

    if (entry.isDirectory() && !entry.name.startsWith('.')) {
      return getAppSourceFiles(fullPath, relativePath);
    }
    if (entry.isFile() && /\.(?:tsx|jsx)$/.test(entry.name)) {
      return [{ path: fullPath, file: relativePath, content: readFileSync(fullPath, 'utf-8') }];
    }
    return [];
  });
}

function hasUseClientDirective(content) {
  try {
    const ast = parse(content, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx', 'decorators-legacy', 'classProperties'],
    });
    return ast.program.directives?.some(
      (directive) => directive.value.value === 'use client',
    ) || false;
  } catch {
    return /^\s*['"]use client['"]\s*;/.test(content);
  }
}

function isImportedAndRendered(pageContent, pagePath, componentPath) {
  const importPath = relative(dirname(pagePath), componentPath)
    .replace(/\\/g, '/')
    .replace(/\.(?:tsx|jsx)$/, '');
  const modulePath = importPath.startsWith('.') ? importPath : `./${importPath}`;
  const escapedPath = modulePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const importMatch = pageContent.match(
    new RegExp(`import\\s+([A-Za-z_$][\\w$]*)\\s+from\\s+['"]${escapedPath}['"]`),
  );

  return Boolean(
    importMatch && new RegExp(`<${importMatch[1]}(?:\\s|/|>)`).test(pageContent),
  );
}

function isServerComponent(content) {
  try {
    const ast = parse(content, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx', 'decorators-legacy', 'classProperties'],
    });
    return !ast.program.directives?.some(
      (directive) => directive.value.value === 'use client',
    );
  } catch {
    return false;
  }
}

function hasNextLink(content) {
  return /import\s+Link\s+from\s+['"]next\/link['"]/.test(content);
}

function hasLinkWithHrefAndText(content, href, text) {
  const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const hrefPattern = escapeRegExp(href);
  const textPattern = escapeRegExp(text);
  return new RegExp(
    `<Link\\b(?=[^>]*\\bhref\\s*=\\s*['"]${hrefPattern}['"])[^>]*>[\\s\\S]*?${textPattern}[\\s\\S]*?<\\/Link>`,
  ).test(content);
}

function checkFileForPatterns(content, patternsRequired, fileName) {
  const patternsFound = [];
  const patternsMissing = [];

  try {
    const ast = parse(content, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx', 'decorators-legacy', 'classProperties']
    });

    const foundPatterns = new Set();

    traverse(ast, {
      // Check for 'use client' directive
      Directive(path) {
        if (path.node.value.value === 'use client') {
          foundPatterns.add('useClient');
          foundPatterns.add('clientComponent');
        }
      },

      // Check for Server Component (no 'use client')
      Program(path) {
        const hasUseClient = path.node.directives?.some(
          d => d.value.value === 'use client'
        );
        if (!hasUseClient && fileName.includes('page.tsx')) {
          foundPatterns.add('serverComponent');
        }
      },

      // Check for Link component
      ImportDeclaration(path) {
        if (path.node.source.value === 'next/link') {
          foundPatterns.add('Link');
        }
        if (path.node.source.value === 'next/navigation') {
          foundPatterns.add('navigation');
        }
      },

      // Check for async component (Server Component data fetching)
      FunctionDeclaration(path) {
        if (path.node.async) {
          foundPatterns.add('asyncComponent');
        }
      },

      ArrowFunctionExpression(path) {
        if (path.node.async) {
          foundPatterns.add('asyncComponent');
        }
      },

      // Check for metadata export
      ExportNamedDeclaration(path) {
        if (path.node.declaration) {
          const decl = path.node.declaration;
          if (decl.id && decl.id.name === 'metadata') {
            foundPatterns.add('metadata');
          }
        }
        path.node.specifiers.forEach(spec => {
          if (spec.exported.name === 'metadata') {
            foundPatterns.add('metadata');
          }
        });
      },

      // Check for API route (route.ts)
      CallExpression(path) {
        if (path.node.callee.name === 'NextResponse') {
          foundPatterns.add('apiRoute');
        }
        if (path.node.callee.object && 
            path.node.callee.object.name === 'Response' &&
            path.node.callee.property &&
            path.node.callee.property.name === 'json') {
          foundPatterns.add('apiRoute');
        }
      },

      // Check for Server Actions
      FunctionDeclaration(path) {
        if (path.node.async && 
            (path.node.id?.name?.includes('action') || 
             content.includes('use server'))) {
          foundPatterns.add('serverAction');
        }
      },

      // Check for form handling
      JSXElement(path) {
        if (path.node.openingElement.name.name === 'form') {
          foundPatterns.add('formHandling');
        }
      },

      // Check for app directory structure
      Program(path) {
        if (fileName.includes('app/')) {
          foundPatterns.add('appDirectory');
        }
        if (fileName.includes('page.tsx')) {
          foundPatterns.add('fileBasedRouting');
        }
      }
    });

    // Check which required patterns were found
    for (const pattern of patternsRequired) {
      if (foundPatterns.has(pattern)) {
        patternsFound.push(pattern);
      } else {
        patternsMissing.push(pattern);
      }
    }

  } catch (error) {
    // If parsing fails, try simple string matching as fallback
    for (const pattern of patternsRequired) {
      if (content.includes(pattern) || content.includes(pattern.replace(/([A-Z])/g, '-$1').toLowerCase())) {
        patternsFound.push(pattern);
      } else {
        patternsMissing.push(pattern);
      }
    }
  }

  return { patternsFound, patternsMissing };
}
