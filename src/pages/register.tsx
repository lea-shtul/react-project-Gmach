import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { register as registerApi } from '../server/authApi';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { getAllMeta } from '../server/metaApi';
import {
  Alert, Box, Button, Link, MenuItem, Paper, Stack, TextField, Typography,
} from '@mui/material';

const schema = yup.object({
  fullName: yup.string().required('שם מלא הוא שדה חובה').min(2, 'לפחות 2 תווים'),
  email: yup.string().required('אימייל הוא שדה חובה').email('כתובת אימייל לא תקינה'),
  password: yup.string().required('סיסמה היא שדה חובה').min(6, 'לפחות 6 תווים'),
  phone: yup.string().required('טלפון הוא שדה חובה').matches(/^05\d{8}$/, 'מספר נייד לא תקין'),
  neighborhood: yup.string().required('יש לבחור שכונה'),
});

type RegisterForm = yup.InferType<typeof schema>;

export const Register = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const { data: meta } = useQuery({
    queryKey: ['meta'],
    queryFn: getAllMeta,
    staleTime: Infinity,
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: yupResolver(schema),
    defaultValues: { fullName: '', email: '', password: '', phone: '', neighborhood: '' },
  });

  const onSubmit = async (data: RegisterForm) => {
    setServerError('');
    try {
      await registerApi(data);
      navigate('/login');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setServerError('כבר קיימת משתמשת עם האימייל הזה');
      } else {
        setServerError('ההרשמה נכשלה, נסי שוב');
      }
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 450 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 1 }}>
          הצטרפי לגמ"ח 🤝
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
          כמה פרטים, ואת בפנים
        </Typography>

        <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2}>
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="שם מלא"
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
                fullWidth
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="אימייל"
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="סיסמה"
                type="password"
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
              />
            )}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="טלפון"
                type="tel"
                error={!!errors.phone}
                helperText={errors.phone?.message}
                fullWidth
              />
            )}
          />

          <Controller
            name="neighborhood"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="שכונה"
                error={!!errors.neighborhood}
                helperText={errors.neighborhood?.message}
                fullWidth
              >
                {meta?.neighborhoods.map((n) => (
                  <MenuItem key={n.value} value={n.value}>{n.label}</MenuItem>
                ))}
              </TextField>
            )}
          />

          {serverError && <Alert severity="error">{serverError}</Alert>}

          <Button type="submit" variant="contained" size="large" disabled={isSubmitting} fullWidth>
            {isSubmitting ? 'נרשמת...' : 'הרשמה'}
          </Button>
        </Stack>

        <Typography variant="body2" sx={{ textAlign: 'center', mt: 3 }}>
          כבר יש לך חשבון?{' '}
          <Link component={RouterLink} to="/login">לכניסה</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;