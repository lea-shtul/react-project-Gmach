import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup'
import "../style/requestForm.css"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRequest } from '../server/requests';
import { useState } from 'react';
import { Alert, Snackbar } from '@mui/material';


type RequestFormProps = { itemId: string };



const schema = yup.object(
    {
        startDate: yup.string().required('יש לבחור תאריך התחלה'),
        endDate: yup.string().required("יש לבחור תאריך סיום"),
        message: yup.string().max(300, "הודעה לא יכולה להכיל יותר מ300")
    })
type RequestFormData = yup.InferType<typeof schema>;



const RequestForm = ({ itemId }: RequestFormProps) => {


    const [snackOpen, setSnackOpen] = useState(false);

    const { register, handleSubmit, watch, formState: { errors }, reset } =
        useForm<RequestFormData>({ resolver: yupResolver(schema) });

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: createRequest,
        onSuccess: () => {
            reset();
            setSnackOpen(true);
            queryClient.invalidateQueries({ queryKey: ['myRequests'] });
            queryClient.invalidateQueries({ queryKey: ['stats'] });
        },
    });

    const onSubmit = (data: RequestFormData) => {
        mutation.mutate({ itemId, ...data });
    };
    const today = new Date().toISOString().slice(0, 10);
    return (
        <form className="request-form" onSubmit={handleSubmit(onSubmit)}>
            <h2>רוצה להשאיל?</h2>

            <div className="request-form__dates">
                <div>
                    <label htmlFor="startDate">מתאריך</label>
                    <input id="startDate" type="date" min={today} {...register('startDate')} />
                    {errors.startDate && <p className="error">{errors.startDate.message}</p>}
                </div>

                <div>
                    <label htmlFor="endDate">עד תאריך</label>
                    <input
                        id="endDate"
                        type="date"
                        min={watch('startDate') || today}
                        {...register('endDate')}
                    />
                    {errors.endDate && <p className="error">{errors.endDate.message}</p>}
                </div>
            </div>

            <label htmlFor="message">הודעה לבעלים (לא חובה)</label>
            <textarea
                id="message"
                rows={3}
                placeholder="למשל: צריכה את זה לשבת שבע ברכות"
                {...register('message')}
            />
            {errors.message && <p className="error">{errors.message.message}</p>}

            <button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'שולחת...' : 'שליחת בקשה'}
            </button>

            
                <Snackbar
                    open={snackOpen}
                    autoHideDuration={3000}
                    onClose={() => setSnackOpen(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert severity="success" variant="filled" onClose={() => setSnackOpen(false)}>
                        הבקשה נשלחה! הבעלים תאשר או תדחה אותה 🎉
                    </Alert>
                </Snackbar>
            
            {mutation.isError && (
                <p className="error">
                    לא ניתן לשלוח את הבקשה. ייתכן שכבר שלחת בקשה על הפריט הזה, או שהתאריכים תפוסים.
                </p>
            )}
        </form>
    );
};


export default RequestForm;