import { lazy } from 'react'

import LazyLoader from './LazyLoader'
import DashboardLayout from './layout/DashboardLayout'

const NotFound = lazy(() => import('../pages/NotFound'))
const DashboardNotFound = lazy(() => import('../pages/DashboardNotFound'))

const AuthAware404 = () => {
  // Check if user is authenticated using same logic as AuthGuard
  let isAuthenticated = false
  try {
    const raw = localStorage.getItem('isAuthenticated')
    if (raw !== null) {
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

  if (isAuthenticated) {
    // Show dashboard 404 with dashboard layout
    return (
      <DashboardLayout>
        <LazyLoader>
          <DashboardNotFound />
        </LazyLoader>
      </DashboardLayout>
    )
  }

  // Show main site 404
  return (
    <LazyLoader>
      <NotFound />
    </LazyLoader>
  )
}

export default AuthAware404
