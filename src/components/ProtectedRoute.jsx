// frontend/src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ProtectedRoute = ({ children, role }) => {
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/auth/me', { withCredentials: true });
        if (res.data?.role === role) {
          setIsAllowed(true);
        } else {
          setIsAllowed(false);
        }
      } catch {
        setIsAllowed(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [role]);

  if (loading) return <div className="p-6 text-center">Checking authentication...</div>;
  return isAllowed ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
