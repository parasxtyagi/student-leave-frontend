// src\components\ProtectedRoute.jsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, authLoading } = useAuth();

  if (authLoading) return <div className="text-center p-8">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
