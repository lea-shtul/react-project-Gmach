import { useContext, useState, type FormEvent } from 'react';
import { Box, Typography, TextField, Button, Alert, Stack, Link } from '@mui/material';
import { userContext } from '../context/userContext';
import { Link as RouterLink } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(userContext);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login({ email, password });
    } catch {
      setError('אימייל או סיסמה שגויים');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      brandHeadingLine1="שכונה אחת,"
      brandHeadingLine2="ארון משותף אחד"
      brandSubtitle="משאילות, שואלות ועוזרות אחת לשנייה, בכל שכונות בני ברק."
    >
      <Typography sx={{ fontSize: 32, fontWeight: 800, mb: 0.5 }}>
        ברוכה השבה
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 3, fontSize: 14 }}>
        התחברי כדי להמשיך לגמ"ח השכונתי
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={1.5}>
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5 }}>אימייל</Typography>
            <TextField
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="name@example.com"
              required
              fullWidth
            />
          </Box>

          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5 }}>סיסמה</Typography>
            <TextField
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              fullWidth
            />
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <Button type="submit" variant="contained" disabled={isLoading} fullWidth sx={{ height: 50, mt: 0.5 }}>
            {isLoading ? 'מתחברת...' : 'כניסה'}
          </Button>
        </Stack>
      </Box>

      <Typography variant="body2" sx={{ textAlign: 'center', mt: 2.5 }}>
        עוד אין לך חשבון?{' '}
        <Link component={RouterLink} to="/register" sx={{ fontWeight: 700 }}>להרשמה</Link>
      </Typography>
    </AuthLayout>
  );
};
