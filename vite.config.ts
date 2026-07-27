import { defineConfig } from 'vite'
import vinext from 'vinext'
import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    vinext(),
    cloudflare({
      configPath: './wrangler.admin.toml',
      viteEnvironment: {
        name: 'rsc',
        childEnvironments: ['ssr'],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: [
      // Only `@/…` — bare `@` would steal Vite virtual ids (`@id/...`).
      { find: /^@\//, replacement: `${rootDir}/` },
    ],
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
  // Vite emits "client component dependency is inconsistently optimized"
  // for @tanstack/react-query under RSC and explicitly recommends excluding
  // it from dep pre-bundling so its "use client" directives survive.
  optimizeDeps: {
    exclude: ['@tanstack/react-query'],
  },
})
