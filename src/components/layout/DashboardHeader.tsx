import { useState, useEffect } from 'react'
import UserDropdown from '@/components/ui/UserDropdown'

const DashboardHeader = () => {
  const [userName, setUserName] = useState<string>('')
  const [userEmail, setUserEmail] = useState<string>('')

  // Get user info from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('user')
      if (raw) {
        const user = JSON.parse(raw) as { name?: string | null; email?: string | null }
        const email = user?.email || ''
        const name = user?.name || (email ? email.split('@')[0] : 'User')
        setUserEmail(email)
        setUserName(name)
      }
    } catch {
      setUserEmail('')
      setUserName('User')
    }
  }, [])

  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Hamburger Menu Button (Mobile Only) */}
          {/* <button 
            // onClick={() => setIsMenuOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button> */}

          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Events</span>
            <span>/</span>
            <span>Create event</span>
          </div>

          {/* User Dropdown */}
          <UserDropdown userName={userName || 'User'} userEmail={userEmail || ''} />
        </div>
      </header>
    </>
  )
}

export default DashboardHeader
