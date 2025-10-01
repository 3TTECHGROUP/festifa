import { Outlet } from 'react-router-dom'
import DashboardHeader from './DashboardHeader'
import DashboardSidebar from './DashboardSidebar'
import MobileBottomNav from './MobileBottomNav'

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto pb-20 lg:pb-0">
          <Outlet />
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}

export default DashboardLayout
