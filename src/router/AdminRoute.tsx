import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { userContext } from '../context/userContext';

const AdminRoute = () => {
  const { user } = useContext(userContext);

  if (user?.role !== 'ADMIN') return <Navigate to="/" replace />;
  return <Outlet />;
};

export default AdminRoute;