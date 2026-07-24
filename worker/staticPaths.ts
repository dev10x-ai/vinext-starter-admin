/** Vite hashed client bundles under `dist/client/assets` (not vinext `public/`). */
export function isViteClientAssetPath(pathname: string): boolean {
  if (typeof pathname !== 'string' || pathname.length === 0) {
    throw new Error('isViteClientAssetPath: pathname must be a non-empty string')
  }
  return pathname.startsWith('/assets/')
}
