import { createBrowserRouter } from 'react-router-dom'
import { lazy } from 'react'
import Layout from '../components/layout/Layout'
import DashboardLayout from '../components/layout/DashboardLayout'
import AuthGuard from '../components/AuthGuard'
import AuthAware404 from '../components/AuthAware404'
import LazyLoader from '../components/LazyLoader'
import ProtectedRoute from '../components/ProtectedRoute'

// Lazy load all page components
const Home = lazy(() => import('../pages/Home'))
const About = lazy(() => import('../pages/About'))
const Services = lazy(() => import('../pages/Services'))
const Contact = lazy(() => import('../pages/Contact'))
const HowItWorks = lazy(() => import('../pages/HowItWorks'))
const Pricing = lazy(() => import('../pages/Pricing'))
const Privacy = lazy(() => import('../pages/Privacy'))
const Terms = lazy(() => import('../pages/Terms'))
const Events = lazy(() => import  ('../pages/Events'))
const EventDetail = lazy(() => import('../pages/EventDetail'))
const Templates = lazy(() => import('../pages/Templates'))
const Signup = lazy(() => import('../pages/Signup'))
const Login = lazy(() => import('../pages/Login'))
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'))
const VerifyOTP = lazy(() => import('../pages/VerifyOTP'))
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Accounts = lazy(() => import('../pages/Accounts'))
const Tickets = lazy(() => import('../pages/Tickets'))
const Discover = lazy(() => import('../pages/Discover'))
const Referrals = lazy(() => import('../pages/Referrals'))
const UserDetails = lazy(() => import('../pages/UserDetails'))
const CreateEvent = lazy(() => import('../pages/CreateEvent'))
const DashboardNotFound = lazy(() => import('../pages/DashboardNotFound'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <LazyLoader>
            <Home />
          </LazyLoader>
        ),
      },
      {
        path: 'about',
        element: (
          <LazyLoader>
            <About />
          </LazyLoader>
        ),
      },
      {
        path: 'services',
        element: (
          <LazyLoader>
            <Services />
          </LazyLoader>
        ),
      },
      {
        path: 'contact',
        element: (
          <LazyLoader>
            <Contact />
          </LazyLoader>
        ),
      },
      {
        path: 'how-it-works',
        element: (
          <LazyLoader>
            <HowItWorks />
          </LazyLoader>
        ),
      },
      {
        path: 'pricing',
        element: (
          <LazyLoader>
            <Pricing />
          </LazyLoader>
        ),
      },
      {
        path: 'events',
        element: (
          <LazyLoader>
            <Events />
          </LazyLoader>
        ),
      },
      {
        path: 'events/:id',
        element: (
          <LazyLoader>
            <EventDetail />
          </LazyLoader>
        ),
      },
      {
        path: 'templates',
        element: (
          <LazyLoader>
            <Templates />
          </LazyLoader>
        ),
      },
      {
        path: 'privacy',
        element: (
          <LazyLoader>
            <Privacy />
          </LazyLoader>
        ),
      },
      {
        path: 'terms',
        element: (
          <LazyLoader>
            <Terms />
          </LazyLoader>
        ),
      },
      {
        path: 'signup',
        element: (
          <ProtectedRoute requireAuth={false}>
            <LazyLoader>
              <Signup />
            </LazyLoader>
          </ProtectedRoute>
        ),
      },
      {
        path: 'login',
        element: (
          <ProtectedRoute requireAuth={false}>
            <LazyLoader>
              <Login />
            </LazyLoader>
          </ProtectedRoute>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <LazyLoader>
            <ForgotPassword />
          </LazyLoader>
        ),
      },
      {
        path: 'verify-otp',
        element: (
          <LazyLoader>
            <VerifyOTP />
          </LazyLoader>
        ),
      },
    ],
  },
  {
    path: '/dashboard',
    element: <AuthGuard />,
    children: [
      {
        path: '',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: (
              <LazyLoader>
                <Dashboard />
              </LazyLoader>
            ),
          },
          {
            path: 'create-event',
            element: (
              <LazyLoader>
                <CreateEvent />
              </LazyLoader>
            ),
          },
          {
            path: 'accounts',
            element: (
              <LazyLoader>
                <Accounts />
              </LazyLoader>
            ),
          },
          {
            path: 'tickets',
            element: (
              <LazyLoader>
                <Tickets />
              </LazyLoader>
            ),
          },
          {
            path: 'discover',
            element: (
              <LazyLoader>
                <Discover />
              </LazyLoader>
            ),
          },
          {
            path: 'referrals',
            element: (
              <LazyLoader>
                <Referrals />
              </LazyLoader>
            ),
          },
          {
            path: 'user-details/:id',
            element: (
              <LazyLoader>
                <UserDetails />
              </LazyLoader>
            ),
          },
          {
            path: '*',
            element: (
              <LazyLoader>
                <DashboardNotFound />
              </LazyLoader>
            ),
          },
        ],
      },
    ],
  },
  // Authentication-aware 404 handler
  {
    path: '*',
    element: <AuthAware404 />,
  },
])
