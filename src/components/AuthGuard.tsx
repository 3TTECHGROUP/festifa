import { Navigate, Outlet } from 'react-router-dom'

const AuthGuard = () => {
  // Check if user is authenticated
  // For now, we'll check localStorage. In production, use proper auth state management
  let isAuthenticated = false
  try {
    const raw = localStorage.getItem('isAuthenticated')
    if (raw !== null) {
      // Support string "true" and JSON boolean true
      if (raw === 'true') {
        isAuthenticated = true
      } else {
        try {
          const parsed = JSON.parse(raw)
          isAuthenticated = parsed === true
        } catch {
          // Non-JSON value; leave as false
        }
      }
    }
  } catch {
    isAuthenticated = false
  }

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />
  }

  // If authenticated, render the child routes
  return <Outlet />
}

export default AuthGuard
