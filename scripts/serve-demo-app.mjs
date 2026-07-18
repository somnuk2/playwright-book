import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { createReadStream, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const appDir = path.join(root, 'demo-app');
const port = Number(process.env.PORT || 4173);

const products = [
  { id: 'backpack', name: 'Sauce Labs Backpack', price: 29.99, description: 'A backpack for test automation practice.' },
  { id: 'bike-light', name: 'Sauce Labs Bike Light', price: 9.99, description: 'A compact bike light.' },
  { id: 'bolt-shirt', name: 'Sauce Labs Bolt T-Shirt', price: 15.99, description: 'A soft black t-shirt.' },
  { id: 'fleece-jacket', name: 'Sauce Labs Fleece Jacket', price: 49.99, description: 'A warm fleece jacket.' }
];

function json(res, status, data) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => resolve(body));
  });
}

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml'
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);

  if (url.pathname === '/health') return json(res, 200, { ok: true });

  if (url.pathname === '/api/products' && req.method === 'GET') {
    return json(res, 200, { products });
  }

  if (url.pathname === '/api/orders' && req.method === 'POST') {
    const body = await readBody(req);
    const order = body ? JSON.parse(body) : {};
    return json(res, 201, { ok: true, orderId: `order-${Date.now()}`, order });
  }

  if (url.pathname === '/graphql' && req.method === 'POST') {
    const body = await readBody(req);
    const payload = body ? JSON.parse(body) : {};
    if (payload.operationName === 'ProductList') {
      return json(res, 200, { data: { products } });
    }
    if (payload.operationName === 'AddToCart') {
      return json(res, 200, { data: { addToCart: { ok: true, productId: payload.variables?.productId || 'unknown' } } });
    }
    return json(res, 200, { data: {} });
  }

  const pathname = url.pathname === '/' ? '/index.html' : url.pathname;
  const filePath = path.normalize(path.join(appDir, pathname));
  if (!filePath.startsWith(appDir) || !existsSync(filePath)) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    return res.end('Not found');
  }
  const ext = path.extname(filePath);
  res.writeHead(200, { 'content-type': contentTypes[ext] || 'application/octet-stream' });
  createReadStream(filePath).pipe(res);
});

server.listen(port, () => {
  console.log(`Demo app is available at http://127.0.0.1:${port}`);
});
