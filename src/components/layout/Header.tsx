import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import logo from '@/assets/images/logo.png'

const Header = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const navItems = [
    { name: 'Events', path: '/events' },
    { name: 'Templates', path: '/templates' },
    { name: 'How it works', path: '/how-it-works' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact us', path: '/contact' },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full" style={{ backgroundColor: '#FFA500' }}>
        <div className="container mx-auto flex h-14 items-center px-4">
          {/* Logo */}
          <div className="flex items-center mr-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center">
                <span className="text-orange-400 font-bold text-lg">
                  <img src={logo} alt="Logo" />
                </span>
              </div>
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="relative flex-1 max-w-md mr-8 hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search for event"
              className="pl-10 bg-white border-0 rounded-md h-9 text-sm"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 flex-1 justify-end mr-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-black text-sm font-medium hover:text-black/80 transition-colors",
                  location.pathname === item.path
                    ? "text-black"
                    : "text-black/90"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Sign up Button */}
          <div className="hidden md:block ml-auto">
            <Button 
              className="bg-black hover:bg-black/90 text-white px-6 py-2 h-9 text-sm font-medium rounded-md"
              onClick={() => navigate('/signup')}
            >
              Sign up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="text-black hover:bg-black/10 p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-orange-400 border-t border-orange-300 z-40">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search for event"
                className="pl-10 bg-white border-0 rounded-md h-9 text-sm w-full"
              />
            </div>
            
            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "text-black text-base font-medium hover:text-black/80 transition-colors py-2",
                    location.pathname === item.path
                      ? "text-black font-semibold"
                      : "text-black/90"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            
            {/* Mobile Sign up Button */}
            <div className="pt-2">
              <Button 
                className="bg-black hover:bg-black/90 text-white px-6 py-2 h-9 text-sm font-medium rounded-md w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign up
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
