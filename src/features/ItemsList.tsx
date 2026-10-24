import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getAllItems } from '../server/itemApis'
import ItemCard from "../components/ItemCard";
import EmptyState from "../components/EmptyState";
import { Alert, Box, Button, MenuItem, Paper, Pagination, Skeleton, Stack, TextField, Typography } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { useContext, useState } from "react";
import type { ItemFilters } from "../types/itemType";
import { useMeta } from "../hooks/useMeta";
import { userContext } from "../context/userContext";

const initialFilters: ItemFilters = {
  page: 1,
  search: '',
  category: '',
  sort: 'newest',
  neighborhood: '',
};

const ItemsList = () => {

  const [filters, setFilters] = useState<ItemFilters>(initialFilters);
  const { user } = useContext(userContext);

  const { data, isPending, isError } = useQuery({
    queryKey: ['items', filters],
    queryFn: () => getAllItems(filters),
    placeholderData: keepPreviousData,
  });

const {meta}=useMeta();



  if (isPending)
    return (
      <Box sx={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={260} />
        ))}
      </Box>
    )
  if (isError)
    return <Alert severity="error">שגיאה בטעינת המוצרים</Alert>

  const pageCount = Math.ceil(data.total / data.pageSize);
  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          marginTop: '28px',
          bgcolor: '#1E1B4B',
          borderRadius: '28px',
          padding: { xs: '28px 20px', sm: '44px 48px 40px' },
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            pointerEvents: 'none',
            width: 360,
            height: 360,
            borderRadius: '50%',
            border: '56px solid #2B2775',
            top: -140,
            left: -60,
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            pointerEvents: 'none',
            width: 140,
            height: 140,
            borderRadius: '50%',
            bgcolor: '#2B2775',
            bottom: -70,
            left: '30%',
          }}
        />

        <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '26px' }}>
          <Box>
            <Typography variant="body2" sx={{ color: '#C9C6EA' }}>
              שלום, {user?.fullName}
            </Typography>
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800, mt: 0.5 }}>
              מה תרצי לשאול{' '}
              <Box component="span" sx={{ color: '#F5B100' }}>
                היום?
              </Box>
            </Typography>
            <Typography variant="body2" sx={{ color: '#C9C6EA', mt: 0.5 }}>
              עייני בכל הפריטים שהשכונה משאילה
            </Typography>
          </Box>

          <Paper
            sx={{
              p: 2,
              width: '100%',
              bgcolor: '#fff',
              borderRadius: '18px',
              boxShadow: '0 18px 40px rgba(8,6,40,0.3)',
              border: 'none',
            }}
          >
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
          </Paper>
        </Box>
      </Box>

      <Stack spacing={3} sx={{ alignItems: 'center', mt: 3 }}>
        {data.items.length === 0 ? (
          <EmptyState
            icon={<SearchOffIcon sx={{ fontSize: 56 }} />}
            title="לא נמצאו פריטים"
            text="ננסה לשנות את החיפוש או הסינון"
            action={<Button variant="outlined" onClick={() => setFilters(initialFilters)}>נקה סינון</Button>}
          />
        ) : (
          <>
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
          </>
        )}
      </Stack>
    </Box>
  );


}

export default ItemsList