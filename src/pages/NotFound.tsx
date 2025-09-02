import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="pt-6">
          <Link 
            to="/" 
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors inline-block"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
