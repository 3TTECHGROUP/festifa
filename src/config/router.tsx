import { createBrowserRouter } from 'react-router-dom'
import { lazy } from 'react'
import Layout from '../components/layout/Layout'
import LazyLoader from '../components/LazyLoader'

// Lazy load all page components
const Home = lazy(() => import('../pages/Home'))
const About = lazy(() => import('../pages/About'))
const Services = lazy(() => import('../pages/Services'))
const Contact = lazy(() => import('../pages/Contact'))
const HowItWorks = lazy(() => import('../pages/HowItWorks'))
const Pricing = lazy(() => import('../pages/Pricing'))
const Privacy = lazy(() => import('../pages/Privacy'))
const Terms = lazy(() => import('../pages/Terms'))
const NotFound = lazy(() => import('../pages/NotFound'))

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
        path: '*',
        element: (
          <LazyLoader>
            <NotFound />
          </LazyLoader>
        ),
      },
    ],
  },
])
