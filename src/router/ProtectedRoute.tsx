import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { userContext } from '../context/userContext';

const ProtectedRoute = () => {
  const { user, isLoading } = useContext(userContext);

  if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
      <CircularProgress />
    </Box>
  );
  if (!user) return <Navigate to="/landing" replace />;
  return <Outlet />;
};

export default ProtectedRoute;