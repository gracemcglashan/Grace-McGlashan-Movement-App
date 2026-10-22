import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { generateMovementFlow } from './server/flowService.ts';

function flowApiPlugin() {
  return {
    name: 'mood-to-movement-api',
    configureServer(server: any) {
      server.middlewares.use('/api/generate-flow', async (req: any, res: any, next: any) => {
        if (req.method !== 'POST') return next();
        const chunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('end', async () => {
          try {
            const raw = Buffer.concat(chunks).toString('utf-8');
            const data = raw ? JSON.parse(raw) : {};
            const flow = await generateMovementFlow(data);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(flow));
          } catch (err: any) {
            console.error('API middleware error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err?.message || 'Failed to process request' }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), flowApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
