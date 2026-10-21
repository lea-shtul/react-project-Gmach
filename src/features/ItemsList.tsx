import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getAllItems } from '../server/itemApis'
import ItemCard from "../components/ItemCard";
import { Alert, Box, CircularProgress, MenuItem, Pagination, Stack, TextField } from "@mui/material";
import { useState } from "react";
import type { ItemFilters } from "../types/itemType";
import { getAllMeta } from "../server/metaApi";

const ItemsList = () => {

  const [filters, setFilters] = useState<ItemFilters>({
    page: 1,
    search: '',
    category: '',
    sort: 'newest',
    neighborhood: ''
  });

  const { data, isPending, isError } = useQuery({
    queryKey: ['items', filters],
    queryFn: () => getAllItems(filters),
    placeholderData: keepPreviousData,
  });

  const { data: meta } = useQuery({
    queryKey: ['meta'],
    queryFn: getAllMeta,
    staleTime: Infinity
  });



  if (isPending)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
        <CircularProgress />
      </Box>
    )
  if (isError)
    return <Alert severity="error">שגיאה בטעינת המוצרים</Alert>

  const pageCount = Math.ceil(data.total / data.pageSize);
  return (
    <Stack spacing={3} sx={{ alignItems: 'center' }}>
      <Stack direction="row" spacing={2} sx={{ width: '100%', flexWrap: 'wrap', gap: 2 }}>
        <TextField
          label="חיפוש"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          sx={{ flexGrow: 1, minWidth: 200 }}
        />

        <TextField
          select
          label="קטגוריה"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">הכל</MenuItem>
          {meta?.categories.map((c) => (
            <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="שכונה"
          value={filters.neighborhood}
          onChange={(e) => setFilters({ ...filters, neighborhood: e.target.value, page: 1 })}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">כל השכונות</MenuItem>
          {meta?.neighborhoods.map((n) => (
            <MenuItem key={n.value} value={n.value}>{n.label}</MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="מיון"
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value, page: 1 })}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="newest">הכי חדשים</MenuItem>
          <MenuItem value="oldest">הכי ישנים</MenuItem>
          <MenuItem value="title">לפי שם</MenuItem>
        </TextField>
      </Stack>
      <Box sx={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
        {data.items.map((item) => <ItemCard key={item.id} item={item} />)}
      </Box>

      {pageCount > 1 && (
        <Pagination
          count={pageCount}
          page={filters.page}
          onChange={(_, value) => setFilters({ ...filters, page: value })}
          color="primary"
        />
      )}
    </Stack>
  );


}

export default ItemsList