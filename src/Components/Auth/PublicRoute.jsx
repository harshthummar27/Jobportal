import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

/**
 * PublicRoute Component
 * 
 * Prevents logged-in users from accessing public routes (login, register)
 * Redirects them to their role-based dashboard instead
 * 
 * @param {ReactNode} children - The component to render if user is not logged in
 */
const PublicRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
          const user = JSON.parse(userStr);
          const role = user.role || null;
          
          setIsLoggedIn(true);
          setUserRole(role);
        } else {
          setIsLoggedIn(false);
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsLoggedIn(false);
        setUserRole(null);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();

    // Listen for storage changes (logout from other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Show nothing while checking (prevents flash of login page)
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-main">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, redirect to their dashboard based on role
  if (isLoggedIn && userRole) {
    const getDashboardPath = (role) => {
      switch (role) {
        case 'candidate':
          return '/candidate/dashboard';
        case 'recruiter':
          return '/recruiter/dashboard';
        case 'staff':
          return '/internal-team/dashboard';
        case 'superadmin':
          return '/superadmin/dashboard';
        default:
          return '/candidate/dashboard';
      }
    };

    return <Navigate to={getDashboardPath(userRole)} replace />;
  }

  // If user is not logged in, render the public component (login/register)
  return children;
};

export default PublicRoute;
