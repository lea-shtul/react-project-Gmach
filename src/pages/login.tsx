import { useContext, useState, type FormEvent } from 'react';
import {Box, Paper, Typography, TextField, Button, Alert, Stack, Link,} from '@mui/material';
import { userContext } from '../context/userContext';
import { Link as RouterLink } from 'react-router-dom';

export const Login = () =>{
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
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 1 }}>
           ברוכה הבאה
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
          התחברי כדי להמשיך לגמ"ח השכונתי
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="אימייל"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              fullWidth
            />
            <TextField
              label="סיסמה"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              fullWidth
            />

            {error && <Alert severity="error">{error}</Alert>}

            <Button type="submit" variant="contained" size="large" disabled={isLoading} fullWidth>
              {isLoading ? 'מתחברת...' : 'כניסה'}
            </Button>
          </Stack>
        </Box>

        <Typography variant="body2" sx={{ textAlign: 'center', mt: 3 }}>
          עוד אין לך חשבון?{' '}
          <Link component={RouterLink} to="/register">להרשמה</Link>
        </Typography>
      </Paper>
    </Box>
  );
};