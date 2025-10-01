import { Calendar, User, Search } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const MobileBottomNav = () => {
  const location = useLocation()
  
  const navItems = [
    { id: 'events', label: 'Events', icon: Calendar, path: '/dashboard' },
    { id: 'account', label: 'Account', icon: User, path: '/dashboard/accounts' },
    { 
      id: 'tickets', 
      label: 'Tickets', 
      icon: () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  ]

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className="flex flex-col items-center gap-1 px-4 py-2 min-w-[70px]"
            >
              <Icon className={`w-6 h-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} />
              <span className={`text-xs ${active ? 'text-orange-500 font-medium' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileBottomNav
