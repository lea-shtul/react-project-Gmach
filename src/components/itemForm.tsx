import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as yup from 'yup'
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createItem, getItemById, updateItem } from "../server/itemApis";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userContext } from "../context/userContext";
import type { Item, newItem } from "../types/itemType";
import {
    Box, Paper, Typography, TextField, MenuItem, Checkbox, FormControlLabel,
    Button, Stack, Alert, CircularProgress,
} from "@mui/material";
import { useMeta } from "../hooks/useMeta";



const schema = yup.object({
    title: yup.string().min(2, "שם הפריט חייב להכיל לפחות 2 תווים").max(80, "שם הפריט חייב להיות עד 80 תווים").required("חובה למלא את שם הפריט"),
    description: yup.string().max(500, "התיאור לא יכול להכיל מעל 500 תווים").default(''),
    category: yup.string().required('יש לבחור קטגוריה'),
    condition: yup.string().required('יש לבחור מצב'),
    neighborhood: yup.string().required('יש לבחור שכונה'),
    isPublic: yup.boolean().default(true),
})
type ItemFormData = yup.InferType<typeof schema>;


const ItemForm = () => {


    const { id } = useParams();
    const isEdit = !!id;

    const { data: item } = useQuery<Item>({
        queryKey: ['item', id],
        queryFn: () => getItemById(id!),
        enabled: isEdit,
    });
    const formValues = item
        ? {
            title: item.title,
            description: item.description ?? '',
            category: item.category,
            condition: item.condition,
            neighborhood: item.neighborhood,
            isPublic: item.isPublic,
        }
        : undefined;


    const { meta } = useMeta();

    const { user } = useContext(userContext)
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            category: '',
            condition: '',
            neighborhood: user?.neighborhood ?? '',//ברירת מחדל: השכונה של המשתמשת, אפשר לשנות
            isPublic: true,
        }, values: formValues
    });

    const mutation = useMutation({
        mutationFn: (data: newItem) =>
            isEdit ? updateItem(id!, data) : createItem(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
            queryClient.invalidateQueries({ queryKey: ['item'] });
            queryClient.invalidateQueries({ queryKey: ['stats'] });
            navigate('/my-items');
        },
    });

    const onSubmit = (data: ItemFormData) => {
        mutation.mutate(data)
    }
    if (!meta || (isEdit && !item)) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
            <CircularProgress />
        </Box>
    );
    return (
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                {isEdit ? 'עריכת פריט' : 'הוספת פריט חדש'}
            </Typography>

            <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2}>
                <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="שם הפריט"
                            error={!!errors.title}
                            helperText={errors.title?.message}
                            fullWidth
                        />
                    )}
                />

                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="תיאור (לא חובה)"
                            multiline
                            rows={3}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                            fullWidth
                        />
                    )}
                />

                <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            select
                            label="קטגוריה"
                            error={!!errors.category}
                            helperText={errors.category?.message}
                            fullWidth
                        >
                            {meta?.categories.map((c) => (
                                <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
                            ))}
                        </TextField>
                    )}
                />

                <Controller
                    name="condition"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            select
                            label="מצב"
                            error={!!errors.condition}
                            helperText={errors.condition?.message}
                            fullWidth
                        >
                            {meta?.conditions.map((c) => (
                                <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
                            ))}
                        </TextField>
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

                <Controller
                    name="isPublic"
                    control={control}
                    render={({ field }) => (
                        <FormControlLabel
                            control={<Checkbox checked={field.value} onChange={field.onChange} />}
                            label="פריט ציבורי (אם לא מסומן, רק את תראי אותו)"
                        />
                    )}
                />

                {mutation.isError && (
                    <Alert severity="error">
                        {isEdit ? 'לא ניתן לשמור את השינויים' : 'לא ניתן להוסיף את הפריט'}, נסי שוב.
                    </Alert>
                )}

                <Stack direction="row" spacing={2}>
                    <Button type="submit" disabled={mutation.isPending} variant="contained">
                        {mutation.isPending ? 'שומרת...' : isEdit ? 'שמירת שינויים' : 'הוספת פריט'}
                    </Button>
                    <Button type="button" variant="outlined" onClick={() => navigate('/my-items')}>
                        ביטול
                    </Button>
                </Stack>
            </Stack>
        </Paper>
    )
}
export default ItemForm
