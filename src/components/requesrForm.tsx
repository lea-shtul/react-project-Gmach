import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRequest } from '../server/requests';
import { useState } from 'react';
import { Alert, Snackbar, Paper, Typography, Stack, TextField, Button } from '@mui/material';


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

    const { control, handleSubmit, watch, formState: { errors }, reset } =
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
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ mb: 2 }}>רוצה להשאיל?</Typography>

            <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Controller
                        name="startDate"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="מתאריך"
                                type="date"
                                slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: today } }}
                                error={!!errors.startDate}
                                helperText={errors.startDate?.message}
                                fullWidth
                            />
                        )}
                    />

                    <Controller
                        name="endDate"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="עד תאריך"
                                type="date"
                                slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: watch('startDate') || today } }}
                                error={!!errors.endDate}
                                helperText={errors.endDate?.message}
                                fullWidth
                            />
                        )}
                    />
                </Stack>

                <Controller
                    name="message"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="הודעה לבעלים (לא חובה)"
                            placeholder="למשל: צריכה את זה לשבת שבע ברכות"
                            multiline
                            rows={3}
                            error={!!errors.message}
                            helperText={errors.message?.message}
                            fullWidth
                        />
                    )}
                />

                {mutation.isError && (
                    <Alert severity="error">
                        לא ניתן לשלוח את הבקשה. ייתכן שכבר שלחת בקשה על הפריט הזה, או שהתאריכים תפוסים.
                    </Alert>
                )}

                <Button type="submit" variant="contained" disabled={mutation.isPending}>
                    {mutation.isPending ? 'שולחת...' : 'שליחת בקשה'}
                </Button>
            </Stack>

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
        </Paper>
    );
};


export default RequestForm;