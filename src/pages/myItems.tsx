import { useQuery } from "@tanstack/react-query"
import { getMyItems } from "../server/itemApis"
import { useContext } from "react";
import { userContext } from "../context/userContext";
import ItemCard from "../components/ItemCard";
import type { Item } from "../types/itemType";
import { Link, Outlet } from "react-router-dom";
import { Box, Typography, Button, Alert, CircularProgress, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";


const MyItems = () => {
    const { user } = useContext(userContext)

    const { data, isLoading, isError } = useQuery({
        queryKey: ['items', 'mine', user?.id],
        queryFn: getMyItems,
    });


    if (isLoading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
            <CircularProgress />
        </Box>
    );
    if (isError) return <Alert severity="error">ארעה שגיאה בטעינת הבקשות , נסה שנית</Alert>;
    if (!data) return null

    return (
        <Box>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">הפריטים שלי</Typography>
                <Button component={Link} to="new" variant="contained" startIcon={<AddIcon />}>
                    פריט חדש
                </Button>
            </Stack>

            <Outlet />

            {data.items.length === 0 ? (
                <Typography color="text.secondary" sx={{ mt: 2 }}>
                    עדיין לא פרסמת פרטים , קדימה תעשה את הצעד הראשון ופרסם
                </Typography>
            ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2, mt: 2 }}>
                    {data.items.map((item: Item) => (
                        <ItemCard item={item} showActions={true} key={item.id} />
                    ))}
                </Box>
            )}
        </Box>
    )

}
export default MyItems