import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { register as registerApi } from '../server/authApi';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import {getAllMeta} from '../server/metaApi'



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
     staleTime: Infinity
   });


    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterForm>({ resolver: yupResolver(schema) });



    const onSubmit = async (data: RegisterForm) => {
        setServerError('');
        try {
            await registerApi(data);
            alert("success  ")
            navigate('/login');
        } catch (err) {
           if (axios.isAxiosError(err) && err.response?.status === 409)
                    setServerError("קיים משתמש עם אימייל  זהה  נסה שוב ")
            else
                    alert("ההרשמה נכשלה")

        }
    };



    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>הרשמה</h1>

            <label htmlFor="fullName">שם מלא</label>
            <input id="fullName" {...register('fullName')} />
            {errors.fullName && <p >{errors.fullName.message}</p>}

            <label htmlFor="email">אימייל</label>
            <input id="email" type="email" {...register('email')} />
            {errors.email && <p>{errors.email.message}</p>}

            <label htmlFor="password">סיסמה</label>
            <input id="password" type="password" {...register('password')} />
            {errors.password && <p>{errors.password.message}</p>}

            <label htmlFor="phone">טלפון</label>
            <input id="phone" type="tel" {...register('phone')} />
            {errors.phone && <p>{errors.phone.message}</p>}

            <label htmlFor="neighborhood">שכונה</label>
            <select id="neighborhood" {...register('neighborhood')}>
                <option value="">בחרי שכונה</option>
                {meta?.neighborhoods.map((n) => (
                    <option key={n.value} value={n.value}>{n.label}</option>
                ))}
            </select>
            {errors.neighborhood && <p>{errors.neighborhood.message}</p>}

            {serverError && <p>{serverError}</p>}

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'נרשמת...' : 'הרשמה'}
            </button>
        </form>
    );
};
export default Register