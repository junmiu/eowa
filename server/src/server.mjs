import { readFile } from 'node:fs/promises';
import { createServer as nodeCreateServer } from 'node:http';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { addClient } from './watcher.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = join(__dirname, '../..');
const clientDir = join(rootDir, 'client');
export const srcDir = join(clientDir, 'src');
const serverDir = join(rootDir, 'server/src');

// TODO: Expand this to handle more file types as needed
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.json': 'application/json',
};

// Cache for resolved module paths
const moduleCache = new Map();

async function resolveModule(moduleName) {
  // Check cache first
  if (moduleCache.has(moduleName)) {
    return moduleCache.get(moduleName);
  }

  // Special handling for specific packages
  if (moduleName === '@vue/reactivity') {
    const resolved = '/node_modules/@vue/reactivity/dist/reactivity.esm-browser.js';
    moduleCache.set(moduleName, resolved);
    return resolved;
  }

  const pkgJsonPath = join(rootDir, 'node_modules', moduleName, 'package.json');
  try {
    const pkgJson = JSON.parse(await readFile(pkgJsonPath, 'utf-8'));

    // Resolve entry point for browser
    let entry;
    if (pkgJson.exports?.['.']) {
      const exp = pkgJson.exports['.'];
      entry = exp.browser?.default || exp.import || exp.default || exp;
    }
    if (!entry) {
      entry = pkgJson.module || pkgJson.main || 'index.js';
    }

    // If entry is still an object, fall back to main
    if (typeof entry === 'object') {
      entry = pkgJson.main || 'index.js';
    }

    const resolved = `/node_modules/${moduleName}/${entry}`;
    moduleCache.set(moduleName, resolved);
    return resolved;
  } catch (e) {
    console.warn(`Could not resolve ${moduleName}:`, e.message);
    return null;
  }
}

function rewriteImports(content) {
  // Rewrite bare imports to resolved paths
  return content.replace(/from\s+['"]([^'"]+)['"]/g, (match, importPath) => {
    // Skip relative imports and already resolved paths
    if (importPath.startsWith('./') ||
      importPath.startsWith('../') ||
      importPath.startsWith('/') ||
      importPath.startsWith('http://') ||
      importPath.startsWith('https://')) {
      return match;
    }

    // This is a bare import - mark it for resolution
    return `from '/@modules/${importPath}'`;
  });
}

export const createDevServer = () => {
  const app = nodeCreateServer();

  app.on('request', async (req, res) => {
    // console.log({ headers: req.headers, method: req.method, url: req.url });

    if (req.method !== 'GET') {
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('Method Not Allowed');
      return;
    }

    if (req.url === '/events') {
      // Handle server-sent events
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      });
      addClient(res);
      return;
    }

    // Handle module resolution
    if (req.url.startsWith('/@modules/')) {
      const moduleName = req.url.slice(10); // Remove '/@modules/'
      const resolvedPath = await resolveModule(moduleName);

      if (!resolvedPath) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Module not found');
        return;
      }

      // Redirect to resolved path
      req.url = resolvedPath;
    }

    let filePath;
    if (req.url === '/') {
      filePath = join(srcDir, 'index.html');
    } else if (req.url === '/__hmr.mjs') {
      filePath = join(serverDir, '__hmr.mjs');
    } else if (req.url.startsWith('/node_modules/')) {
      // Serve from node_modules in the root directory
      filePath = join(rootDir, req.url);
    } else {
      filePath = join(srcDir, req.url);
    }

    try {
      let content = await readFile(filePath, 'utf-8');
      const ext = extname(filePath);
      const contentType = mimeTypes[ext];
      // TODO: handle other file types properly
      if (!contentType) {
        throw { code: 'ENOENT' }; // Simulate not found for non-HTML files
      }

      if (ext === '.html') {
        // Inject HMR script before closing </body> tag
        const hmrScript = `
        <script type="module" src="/__hmr.mjs"></script>
        `;
        content = content.replace('</body>', `${hmrScript}</body>`);
      }

      // Rewrite imports in JS/MJS files
      if (ext === '.js' || ext === '.mjs') {
        content = rewriteImports(content);
      }

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    } catch (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      }
    }
  });

  const port = 3000;
  app.listen(port, () => {
    console.log(`Dev server running at http://localhost:${port}/`);
  });
  return app;
};
