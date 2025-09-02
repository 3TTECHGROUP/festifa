import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface PreloaderProps {
  onComplete?: () => void
  minDuration?: number
}

const Preloader = ({ onComplete, minDuration = 2000 }: PreloaderProps) => {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 100)

    // Minimum duration timer
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        onComplete?.()
      }, 500) // Wait for fade out animation
    }, minDuration)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(timer)
    }
  }, [onComplete, minDuration])

  if (!isVisible) {
    return (
      <div className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background",
        "transition-opacity duration-500 opacity-0 pointer-events-none"
      )}>
        <div className="text-center space-y-8">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-primary">Festifa</h1>
            <div className="w-64 h-2 bg-muted rounded-full mx-auto overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">Loading amazing experiences...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center bg-background",
      "transition-opacity duration-500"
    )}>
      <div className="text-center space-y-8">
        {/* Main spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-primary/40 rounded-full animate-spin mx-auto" 
               style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
        
        {/* Brand and progress */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-primary animate-pulse">Festifa</h1>
          <div className="w-64 h-2 bg-muted rounded-full mx-auto overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-300 rounded-full"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">Loading amazing experiences...</p>
        </div>
        
        {/* Floating dots animation */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

export default Preloader
