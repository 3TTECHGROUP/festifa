import { Calendar, User, Search } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const DashboardSidebar = () => {
  const location = useLocation()
  
  const navItems = [
    { id: 'events', label: 'Events', icon: Calendar, path: '/dashboard' },
    { id: 'accounts', label: 'Accounts', icon: User, path: '/dashboard/accounts' },
    { 
      id: 'tickets', 
      label: 'Tickets', 
      icon: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      ), 
      path: '/dashboard/tickets' 
    },
    { 
      id: 'discover', 
      label: 'Discover', 
      icon: Search, 
      path: '/dashboard/discover' 
    },
    { 
      id: 'referrals', 
      label: 'Referrals', 
      icon: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ), 
      path: '/dashboard/referrals' 
    },
  ]

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-shrink-0 min-h-screen flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900">Festifa</h1>
      </div>
      
      <nav className="px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                active
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default DashboardSidebar
