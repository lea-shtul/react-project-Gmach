import { useQuery } from "@tanstack/react-query"
import {getAllItems} from '../server/itemApis'
import ItemCard from "../components/ItemCard";
import type { Item } from "../types/itemType";
import { Box } from "@mui/material";

const ItemsList=()=>{


const { data, isPending, isError } = useQuery({
  queryKey: ['items'],
  queryFn: getAllItems,
});



if (isPending)
    return <p>טוען מוצרים</p>
if(isError)
    return <p>שגיאה בטעינן המוצרים</p>


return (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: 2,
    }}
  >
    {data.items.map((item: Item) => <ItemCard key={item.id} item={item} />)}
  </Box>
);


}

export default ItemsList