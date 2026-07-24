import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'references', 'website', 'e2e', 'dist'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'next/server': path.resolve(__dirname, './node_modules/vinext/dist/shims/server.js'),
      'next/link': path.resolve(__dirname, './node_modules/vinext/dist/shims/link.js'),
      'next/navigation': path.resolve(
        __dirname,
        './node_modules/vinext/dist/shims/navigation.js',
      ),
      'next/headers': path.resolve(__dirname, './node_modules/vinext/dist/shims/headers.js'),
      'next/image': path.resolve(__dirname, './node_modules/vinext/dist/shims/image.js'),
    },
  },
})
