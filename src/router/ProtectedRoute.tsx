import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { userContext } from '../context/userContext';

const ProtectedRoute = () => {
  const { user, isLoading } = useContext(userContext);

  if (isLoading) return <p>טוען...</p>;
  if (!user) return <Navigate to="/landing" replace />;
  return <Outlet />;
};

export default ProtectedRoute;