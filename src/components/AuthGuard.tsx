import { Navigate, Outlet } from 'react-router-dom'

const AuthGuard = () => {
  // Check if user is authenticated
  // For now, we'll check localStorage. In production, use proper auth state management
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />
  }

  // If authenticated, render the child routes
  return <Outlet />
}

export default AuthGuard
