import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { register as registerApi } from '../server/authApi';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';
import {
    Alert, Box, Button, Link, MenuItem, Stack, TextField, Typography,
} from '@mui/material';
import { useMeta } from '../hooks/useMeta';
import AuthLayout from '../components/AuthLayout';

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

    const { meta } = useMeta()

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
        <AuthLayout
            brandHeadingLine1="מה שעומד אצלך בארון,"
            brandHeadingLine2="יכול לעזור לשכנה"
            brandSubtitle="משאילות, שואלות ועוזרות אחת לשנייה, בכל שכונות בני ברק."
        >
            <Typography sx={{ fontSize: 30, fontWeight: 800, mb: 0.5 }}>
                הצטרפות לגמ"ח
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 2.5, fontSize: 14 }}>
                כמה פרטים ואת בפנים
            </Typography>

            <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={1.5}>
                <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5 }}>שם מלא</Typography>
                    <Controller
                        name="fullName"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                error={!!errors.fullName}
                                helperText={errors.fullName?.message}
                                fullWidth
                            />
                        )}
                    />
                </Box>

                <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5 }}>אימייל</Typography>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="email"
                                placeholder="name@example.com"
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                fullWidth
                            />
                        )}
                    />
                </Box>

                <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5 }}>סיסמה</Typography>
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="password"
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                fullWidth
                            />
                        )}
                    />
                </Box>

                <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5 }}>טלפון</Typography>
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="tel"
                                error={!!errors.phone}
                                helperText={errors.phone?.message}
                                fullWidth
                            />
                        )}
                    />
                </Box>

                <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5 }}>שכונה</Typography>
                    <Controller
                        name="neighborhood"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
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
                </Box>

                {serverError && <Alert severity="error">{serverError}</Alert>}

                <Button type="submit" variant="contained" disabled={isSubmitting} fullWidth sx={{ height: 50 }}>
                    {isSubmitting ? 'נרשמת...' : 'הרשמה'}
                </Button>
            </Stack>

            <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                כבר יש לך חשבון?{' '}
                <Link component={RouterLink} to="/login" sx={{ fontWeight: 700 }}>לכניסה</Link>
            </Typography>
        </AuthLayout>
    );
};

export default Register;
