import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './router.tsx'
import ErrorBoundary from '@/components/ErrorBoundary'
import AppLoader from '@/components/AppLoader'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AppLoader>
        <AppRouter />
        <Toaster richColors position="top-right" />
      </AppLoader>
    </ErrorBoundary>
  </StrictMode>,
)
