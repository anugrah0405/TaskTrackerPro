// render-build.js - ES module version
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

// Build the server-side code
console.log('Building server code...');
try {
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });
} catch (error) {
  console.error('Server build failed:', error);
  process.exit(1);
}

// Copy package.json to dist (needed for production start)
console.log('Copying package.json to dist...');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
// Only keep necessary dependencies for production
const prodPkg = {
  name: pkg.name,
  version: pkg.version,
  type: pkg.type,
  dependencies: pkg.dependencies,
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