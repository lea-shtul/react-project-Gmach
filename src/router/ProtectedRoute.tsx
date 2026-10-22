import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress ,Typography} from '@mui/material';
import { userContext } from '../context/userContext';
import Header from '../features/header';

const ProtectedRoute = () => {
  const { user, isLoading } = useContext(userContext);

  if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
      <CircularProgress />
    </Box>
  );
  if (!user) return <Navigate to="/landing" replace />;
  return (
    <>
      <Header />
      <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%', p: { xs: 2, sm: 3 } }}>
        <Outlet />
      </Box>
      <Box component="footer" sx={{ py: 2, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">
          גמ"ח שכונתי © {new Date().getFullYear()}
        </Typography>
      </Box>
    </>
  );
};

export default ProtectedRoute;