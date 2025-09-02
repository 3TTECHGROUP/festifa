import { useState, useEffect, type ReactNode } from 'react'
import Preloader from '@/components/Preloader'

interface AppLoaderProps {
  children: ReactNode
}

const AppLoader = ({ children }: AppLoaderProps) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate app initialization
    const initializeApp = async () => {
      // You can add actual initialization logic here:
      // - Load user preferences
      // - Initialize analytics
      // - Load critical data
      // - Check authentication status
      
      // For now, just simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsLoading(false)
    }

    initializeApp()
  }, [])

  if (isLoading) {
    return <Preloader minDuration={2000} />
  }

  return <>{children}</>
}

export default AppLoader
