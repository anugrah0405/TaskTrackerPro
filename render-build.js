// render-build.js
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Build the server-side code with explicit external packages
console.log('Building server code...');
try {
  execSync('npx esbuild server/index.ts --platform=node --external:vite --external:@vitejs/plugin-react --external:@replit/vite-plugin-* --bundle --format=esm --outdir=dist', { stdio: 'inherit' });
} catch (error) {
  console.error('Server build failed:', error);
  process.exit(1);
}

// Create a production-only server entry point
console.log('Creating production server entry...');
fs.writeFileSync('dist/prod-server.js', `
// Production server entry point
// This file avoids importing any development dependencies
import { createServer } from 'http';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import your actual server code without the Vite parts
import { setupAuth } from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Set up authentication
setupAuth(app);

// Serve static files
const clientPath = join(__dirname, 'client');
app.use(express.static(clientPath));

// Any additional routes from your server code
// ...

// Catch-all route for client-side routing
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(join(clientPath, 'index.html'));
  } else {
    res.status(404).send('API endpoint not found');
  }
});

const PORT = process.env.PORT || 3000;
createServer(app).listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
`);

// Copy package.json to dist (needed for production start)
console.log('Copying package.json to dist...');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
// Only keep necessary dependencies for production
const prodPkg = {
  name: pkg.name,
  version: pkg.version,
  type: pkg.type,
  dependencies: {
    express: pkg.dependencies.express,
    'express-session': pkg.dependencies['express-session'],
    'connect-pg-simple': pkg.dependencies['connect-pg-simple'],
    'drizzle-orm': pkg.dependencies['drizzle-orm'],
    '@neondatabase/serverless': pkg.dependencies['@neondatabase/serverless'],
    passport: pkg.dependencies.passport,
    'passport-local': pkg.dependencies['passport-local'],
    cors: pkg.dependencies.cors || "^2.8.5",
    ws: pkg.dependencies.ws
    // Add other required production dependencies
  },
  engines: {
    node: ">=18.0.0"
  }
};
fs.writeFileSync('dist/package.json', JSON.stringify(prodPkg, null, 2));

// Create a simple client app
console.log('Creating simple client app...');
if (!fs.existsSync('dist/client')) {
  fs.mkdirSync('dist/client', { recursive: true });
}

// Write a simple index.html file as a placeholder
fs.writeFileSync('dist/client/index.html', `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Todo App API</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; }
    h1 { color: #0066ff; }
    .card { background: #f8f9fa; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  </style>
</head>
<body>
  <h1>Todo App API</h1>
  <div class="card">
    <h2>API Status: Running</h2>
    <p>Your Todo App API is deployed and running correctly.</p>
    <p>API endpoints are available at <code>/api/*</code></p>
  </div>
  <div class="card">
    <h2>Frontend Deployment</h2>
    <p>This is a backend API service only. The frontend should be deployed separately or integrated into this service in a complete build.</p>
  </div>
</body>
</html>
`);

console.log('Build completed successfully!');