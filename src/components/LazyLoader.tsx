import { Suspense, type ReactNode } from 'react'
import Preloader from '@/components/Preloader'

interface LazyLoaderProps {
  children: ReactNode
  fallback?: ReactNode
}

const LazyLoader = ({ children, fallback }: LazyLoaderProps) => {
  return (
    <Suspense fallback={fallback || <Preloader minDuration={800} />}>
      {children}
    </Suspense>
  )
}

export default LazyLoader
