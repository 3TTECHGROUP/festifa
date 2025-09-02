import { RouterProvider } from 'react-router-dom'
import { router } from './config/router'

const AppRouter = () => {
  return <RouterProvider router={router} />
}

export default AppRouter