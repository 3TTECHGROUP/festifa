import { Outlet } from 'react-router-dom'
import DashboardHeader from './DashboardHeader'
import DashboardSidebar from './DashboardSidebar'
import MobileBottomNav from './MobileBottomNav'

interface DashboardLayoutProps {
  children?: React.ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto pb-20 lg:pb-0">
          {children || <Outlet />}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}

export default DashboardLayout
