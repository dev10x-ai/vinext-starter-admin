import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    globals: true,
    include: ['app/**/*.{test,spec}.{ts,tsx}', 'components/**/*.{test,spec}.{ts,tsx}', 'lib/**/*.{test,spec}.{ts,tsx}', 'hooks/**/*.{test,spec}.{ts,tsx}', 'worker/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'references', 'website', 'e2e', 'dist'],
  },
  resolve: {
    alias: [
      // Match `@/*` only — bare `@` would steal Vite virtual ids (`@id/...`).
      { find: /^@\//, replacement: `${path.resolve(__dirname)}/` },
      {
        find: 'next/server',
        replacement: path.resolve(__dirname, './node_modules/vinext/dist/shims/server.js'),
      },
      {
        find: 'next/link',
        replacement: path.resolve(__dirname, './node_modules/vinext/dist/shims/link.js'),
      },
      {
        find: 'next/navigation',
        replacement: path.resolve(
          __dirname,
          './node_modules/vinext/dist/shims/navigation.js',
        ),
      },
      {
        find: 'next/headers',
        replacement: path.resolve(__dirname, './node_modules/vinext/dist/shims/headers.js'),
      },
      {
        find: 'next/image',
        replacement: path.resolve(__dirname, './node_modules/vinext/dist/shims/image.js'),
      },
    ],
  },
})
