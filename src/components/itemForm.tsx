import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getAllMeta } from "../server/metaApi"
import * as yup from 'yup'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createItem, getItemById, updateItem } from "../server/itemApis";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userContext } from "../context/userContext";
import "../style/requestForm.css"
import type { Item, newItem } from "../types/itemType";
import { Button } from "@mui/material";



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


    const { data: meta } = useQuery({
        queryKey: ['meta'],
        queryFn: getAllMeta,
        staleTime: Infinity
    });

    const { user } = useContext(userContext)
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const {
        register,
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
    if (!meta || (isEdit && !item)) return <p>טוען...</p>;
    return (
        <form className="request-form" onSubmit={handleSubmit(onSubmit)}>
            <h2>{isEdit ? 'עריכת פריט' : 'הוספת פריט חדש'}</h2>

            <label htmlFor="title">שם הפריט</label>
            <input id="title" {...register('title')} />
            {errors.title && <p className="error">{errors.title.message}</p>}

            <label htmlFor="description">תיאור (לא חובה)</label>
            <textarea id="description" rows={3} {...register('description')} />
            {errors.description && <p className="error">{errors.description.message}</p>}

            <label htmlFor="category">קטגוריה</label>
            <select id="category" {...register('category')}>
                <option value="" disabled>בחרי קטגוריה</option>
                {meta?.categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            {errors.category && <p className="error">{errors.category.message}</p>}

            <label htmlFor="condition">מצב</label>
            <select id="condition" {...register('condition')}>
                <option value="" disabled>בחרי מצב</option>
                {meta?.conditions.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            {errors.condition && <p className="error">{errors.condition.message}</p>}

            <label htmlFor="neighborhood">שכונה</label>
            <select id="neighborhood" {...register('neighborhood')}>
                <option value="" disabled>בחרי שכונה</option>
                {meta?.neighborhoods.map((n) => <option key={n.value} value={n.value}>{n.label}</option>)}
            </select>
            {errors.neighborhood && <p className="error">{errors.neighborhood.message}</p>}

            <label>
                <input type="checkbox" {...register('isPublic')} />
                פריט ציבורי (אם לא מסומן, רק את תראי אותו)
            </label>

            <Button type="submit" disabled={mutation.isPending} variant="contained" >
                {mutation.isPending ? 'שומרת...' : isEdit ? 'שמירת שינויים' : 'הוספת פריט'}
            </Button>
            <Button type="button" variant="contained" onClick={() => navigate('/my-items')}>ביטול</Button>

            {mutation.isError && (
                <p className="error">{isEdit ? 'לא ניתן לשמור את השינויים' : 'לא ניתן להוסיף את הפריט'}, נסי שוב.</p>
            )}
        </form>
    )
}
export default ItemForm
