import { readFile } from 'node:fs/promises';
import { createServer as nodeCreateServer } from 'node:http';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = join(__dirname, '../..');
const clientDir = join(rootDir, 'client');
const srcDir = join(clientDir, 'src');

// TODO: Expand this to handle more file types as needed
const mimeTypes = {
  '.html': 'text/html',
};

export const createDevServer = () => {
  const app = nodeCreateServer();

  app.on('request', async (req, res) => {
    console.log({ headers: req.headers, method: req.method, url: req.url });

    if (req.method !== 'GET') {
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('Method Not Allowed');
      return;
    }

    let filePath;
    if (req.url === '/') {
      filePath = join(srcDir, 'index.html');
    } else {
      filePath = join(srcDir, req.url);
    }

    try {
      const content = await readFile(filePath, 'utf-8');
      const ext = extname(filePath);
      const contentType = mimeTypes[ext];
      // TODO: handle other file types properly
      if (!contentType) {
        throw { code: 'ENOENT' }; // Simulate not found for non-HTML files
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

