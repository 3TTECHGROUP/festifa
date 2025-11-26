/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { useLogoutMutation } from '@/RTK/RegisterUserQuery/registerQuery';

interface UserDropdownProps {
  userName?: string;
  userEmail?: string;
  avatarUrl?: string;
}

const UserDropdown = ({ userName = '', userEmail = '', avatarUrl }: UserDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [logoutReq, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutReq().unwrap();
      toast.success('Logged out successfully');
    } catch (err: any) {
      // Proceed with local cleanup even if API errors
      const msg = err?.data?.message || err?.error || 'Logout failed, clearing session locally';
      toast.error(msg);
    } finally {
      try {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        localStorage.removeItem('email_verified');
      } finally {
        setIsOpen(false);
        navigate('/');
        window.location.reload();
      }
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1 rounded-full hover:bg-black/10 transition-colors"
      >
        <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
          {avatarUrl ? (
            <img src={avatarUrl} alt={userName || 'User'} className="w-full h-full rounded-full object-cover" />
          ) : (
            getInitials(userName || (userEmail ? userEmail.split('@')[0] : 'U'))
          )}
        </div>
        <span className="text-black text-sm font-medium hidden md:block">{userName || (userEmail ? userEmail.split('@')[0] : 'User')}</span>
        <svg
          className={`w-4 h-4 text-black transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={userName || 'User'} className="w-full h-full rounded-full object-cover" />
                ) : (
                  getInitials(userName || (userEmail ? userEmail.split('@')[0] : 'U'))
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{userName || (userEmail ? userEmail.split('@')[0] : 'User')}</p>
                <p className="text-xs text-gray-500">{userEmail}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <User className="w-4 h-4 mr-3" />
              Go to Dashboard
            </Link>
            
            <Link
              to="/dashboard/accounts"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-4 h-4 mr-3" />
              Account Settings
            </Link>
            
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-60"
            >
              <LogOut className="w-4 h-4 mr-3" />
              {isLoggingOut ? 'Logging out…' : 'Logout'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
