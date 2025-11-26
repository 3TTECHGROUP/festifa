import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './router.tsx'
import ErrorBoundary from '@/components/ErrorBoundary'
import AppLoader from '@/components/AppLoader'
import { Toaster } from 'sonner'
import { Provider } from 'react-redux'
import { store } from './store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <AppLoader>
          <AppRouter />
          <Toaster richColors position="top-right" />
        </AppLoader>
      </ErrorBoundary>
    </Provider>
  </StrictMode>,
)
