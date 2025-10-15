import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean; // true = require login, false = require logout
}

const ProtectedRoute = ({ 
  children, 
  redirectTo = '/dashboard', 
  requireAuth = false 
}: ProtectedRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (requireAuth && !isAuthenticated) {
      // User needs to be logged in but isn't
      navigate('/login');
    } else if (!requireAuth && isAuthenticated) {
      // User needs to be logged out but is logged in (e.g., signup page)
      navigate(redirectTo);
    }
  }, [navigate, redirectTo, requireAuth]);

  return <>{children}</>;
};

export default ProtectedRoute;
