import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Home from '../pages/Home'
import About from '../pages/About'
import Services from '../pages/Services'
import Contact from '../pages/Contact'
import Privacy from '../pages/Privacy'
import Terms from '../pages/Terms'
import NotFound from '../pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'services',
        element: <Services />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'privacy',
        element: <Privacy />,
      },
      {
        path: 'terms',
        element: <Terms />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])
