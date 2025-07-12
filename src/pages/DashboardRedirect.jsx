import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Assuming useAuth provides user and isAuthenticated

const DashboardRedirect = () => {
  const { user, isAuthenticated, isLoading } = useAuth(); // Get user info from context
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) { // Wait for auth state to be resolved
      if (isAuthenticated && user) {
        if (user.role === 'admin') {
          navigate('/admin', { replace: true }); // Redirect to admin dashboard
        } else if (user.role === 'student') {
          navigate('/student', { replace: true }); // Redirect to student dashboard
        } else {
          // Fallback for unknown roles or if not authenticated but somehow landed here
          navigate('/login', { replace: true });
        }
      } else {
        // If not authenticated, redirect to login
        navigate('/login', { replace: true });
      }
    }
  }, [isAuthenticated, user, isLoading, navigate]); // Dependencies for useEffect

  // You can render a loading spinner or message while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-lg text-gray-700">Redirecting to dashboard...</p>
    </div>
  );
};

export default DashboardRedirect;