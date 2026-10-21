import { useQuery } from "@tanstack/react-query"
import { getMyItems } from "../server/itemApis"
import { useContext } from "react";
import { userContext } from "../context/userContext";
import ItemCard from "../components/ItemCard";
import type { Item } from "../types/itemType";
import { Link, Outlet } from "react-router-dom";


const MyItems = () => {
    const { user } = useContext(userContext)

    const { data, isLoading, isError } = useQuery({
        queryKey: ['items', 'mine', user?.id],
        queryFn: getMyItems,
    });


    if (isLoading) return <p>בטעינה...</p>
    if (isError) return <p>ארעה שגיאה בטעינת הבקשות , נסה שנית</p>
    if (!data) return null
    if (data.items.length == 0) return <div>
        <p>עדיין לא פרסמת פרטים , קדימה תעשה את הצעד הראשון ופרסם </p>
        <Link to="new" >+ פריט חדש</Link>
        <Outlet></Outlet>
    </div>
    return (
        <div>
            <Link to="new" >+ פריט חדש</Link>
            <Outlet></Outlet>
            הפריטים שלי
            {data.items.map((item: Item) => <ItemCard item={item} showActions={true} key={item.id}></ItemCard>)}
        </div>
    )

}
export default MyItems