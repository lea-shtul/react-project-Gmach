import { useQuery } from "@tanstack/react-query"
import { getMyItems } from "../server/itemApis"
import { useContext } from "react";
import { userContext } from "../context/userContext";
import ItemCard from "../components/ItemCard";
import type { Item } from "../types/itemType";
import { Link, Outlet } from "react-router-dom";
import { Box, Button, Alert, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";


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
    if (isError) return <Alert severity="error">אירעה שגיאה בטעינת הפריטים, נסי שנית</Alert>;
    if (!data) return null

    return (
        <Box>
            <PageHeader
                title="הפריטים שלי"
                subtitle="נהלי את הפריטים שפרסמת"
                action={
                    <Button component={Link} to="new" variant="contained" startIcon={<AddIcon />}>
                        פריט חדש
                    </Button>
                }
            />

            <Outlet />

            {data.items.length === 0 ? (
                <EmptyState
                    icon={<Inventory2Icon sx={{ fontSize: 56 }} />}
                    title="עדיין לא פרסמת פריטים"
                    text="קדימה תעשי את הצעד הראשון ופרסמי"
                    action={
                        <Button component={Link} to="new" variant="contained" startIcon={<AddIcon />}>
                            פריט חדש
                        </Button>
                    }
                />
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