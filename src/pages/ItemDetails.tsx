import { Link, useParams } from "react-router-dom"
import { useContext } from "react"
import { userContext } from "../context/userContext"
import RequestForm from "../components/requesrForm"
import { Box, Stack, Chip, Typography, Button, Alert, CircularProgress } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { useMeta } from "../hooks/useMeta"
import { useItem } from "../hooks/useItem"



const ItemDetails = () => {
    const { id } = useParams();

    const { data: item, isLoading, isError } = useItem(id);

 const { getLabel } = useMeta()
    const { user } = useContext(userContext);
    const isOwner = user?.id == item?.ownerId

    if (isLoading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
            <CircularProgress />
        </Box>
    );
    if (isError) return (
        <Box sx={{ maxWidth: 700, mx: 'auto', p: 3 }}>
            <Alert severity="error">הפריט לא נמצא</Alert>
        </Box>
    );
    if (!item) return null;

    const categoryLabel = getLabel("categories",item.category);
    const conditionLabel =getLabel("conditions",item.condition);

    const infoItems = [
        { label: 'מצב', value: conditionLabel },
        { label: 'שכונה', value: item.neighborhood },
        { label: 'מפרסמת', value: item.owner.fullName },
        { label: 'פורסם בתאריך', value: new Date(item.createdAt).toLocaleDateString('he-IL') },
    ];

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%', p: { xs: 2, sm: 3 } }}>
            <Box sx={{ maxWidth: 700, mx: 'auto' }}>
                <Button component={Link} to="/" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
                    חזרה לרשימה
                </Button>
            </Box>

            <Box
                sx={{
                    maxWidth: 700,
                    mx: 'auto',
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                    p: 3,
                }}
            >
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                    <Chip label={categoryLabel} size="small" color="primary" variant="outlined" />
                    {!item.isPublic && <Chip label="פרטי" size="small" />}
                    <Chip
                        label={item.isAvailable ? 'זמין להשאלה' : 'מושאל כרגע'}
                        size="small"
                        color={item.isAvailable ? 'success' : 'default'}
                    />
                </Stack>

                <Typography variant="h5" sx={{ mt: 1.5, mb: 1 }}>{item.title}</Typography>

                {item.description && (
                    <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                        {item.description}
                    </Typography>
                )}

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                        gap: 2,
                        mt: 3,
                        pt: 2,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    {infoItems.map(({ label, value }) => (
                        <Box key={label}>
                            <Typography variant="caption" color="text.secondary">{label}</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{value}</Typography>
                        </Box>
                    ))}
                </Box>

                <Box sx={{ mt: 3 }}>
                    {isOwner ? (
                        <Button variant="contained" component={Link} to={`/my-items/${item.id}/edit`}>
                            עריכת הפריט
                        </Button>
                    ) : item.isAvailable ? (
                        <RequestForm itemId={item.id} />
                    ) : (
                        <Alert severity="info">הפריט מושאל כרגע. אפשר לחזור מאוחר יותר</Alert>
                    )}
                </Box>
            </Box>
        </Box>
    );
};




export default ItemDetails