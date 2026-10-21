import { keepPreviousData, useQuery } from "@tanstack/react-query"
import {getAllItems} from '../server/itemApis'
import ItemCard from "../components/ItemCard";
import type { Item } from "../types/itemType";
import { Box , Pagination, Stack} from "@mui/material";
import { useState } from "react";

const ItemsList=()=>{

const [page,setPage]=useState(1)
const { data, isPending, isError } = useQuery({
  queryKey: ['items',page],
  queryFn:()=> getAllItems(page),
  placeholderData: keepPreviousData,//כשיטען לי העמוד הבא , העמוד הקודם ישאר עד שיבוא העמוד הבא ולא יהפוך לטוען
});



if (isPending)
    return <p>טוען מוצרים</p>
if(isError)
    return <p>שגיאה בטעינן המוצרים</p>

const pageCount = Math.ceil(data.total / data.pageSize);
return (
  <Stack spacing={3} sx={{ alignItems: 'center' }}>
    <Box sx={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
      {data.items.map((item) => <ItemCard key={item.id} item={item} />)}
    </Box>

    {pageCount > 1 && (
      <Pagination
        count={pageCount}
        page={page}
        onChange={(_, value) => setPage(value)}
        color="primary"
      />
    )}
  </Stack>
);


}

export default ItemsList