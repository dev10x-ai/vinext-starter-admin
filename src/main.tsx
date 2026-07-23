import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './styles/globals.css'
import { useThemeStore } from './store/theme'
import { queryClient } from './lib/queryClient'

function Root() {
  const hydrate = useThemeStore((s) => s.hydrate)
  useEffect(() => {
    hydrate()
  }, [hydrate])
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
