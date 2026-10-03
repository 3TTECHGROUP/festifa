import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import UserDropdown from '@/components/ui/UserDropdown'
import { auth } from '@/config/firebase'

const DashboardHeader = () => {
  const [userName, setUserName] = useState<string>('')
  const [userEmail, setUserEmail] = useState<string>('')
  const [avatarUrl, setAvatarUrl] = useState<string>('')

  // Get user info from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('user')
      if (raw) {
        const user = JSON.parse(raw) as { name?: string | null; email?: string | null; picture?: string | null }
        const email = user?.email || ''
        const name = user?.name || (email ? email.split('@')[0] : 'User')
        setUserEmail(email)
        setUserName(name)
        setAvatarUrl(user?.picture || '')
      }
    } catch {
      setUserEmail('')
      setUserName('User')
      setAvatarUrl('')
    }
  }, [])

  // Backfills name/picture from the live Firebase profile for sessions stored
  // before those fields were persisted to localStorage on login.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (!fbUser) return
      try {
        const raw = localStorage.getItem('user')
        const user = raw ? JSON.parse(raw) : {}
        const name = user?.name || fbUser.displayName || null
        const picture = user?.picture || fbUser.photoURL || null
        if (name !== user?.name || picture !== user?.picture) {
          localStorage.setItem('user', JSON.stringify({ ...user, name, picture }))
          setUserName(name || (user?.email ? user.email.split('@')[0] : 'User'))
          setAvatarUrl(picture || '')
        }
      } catch {
        // Ignore malformed localStorage state; the initial load's fallback already covers it.
      }
    })
    return () => unsubscribe()
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
          <UserDropdown userName={userName || 'User'} userEmail={userEmail || ''} avatarUrl={avatarUrl} />
        </div>
      </header>
    </>
  )
}

export default DashboardHeader
