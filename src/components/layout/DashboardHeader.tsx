import { User } from 'lucide-react'


const DashboardHeader = () => {

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

          {/* User Profile Icon */}
          <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
            <User className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>
    </>
  )
}

export default DashboardHeader
