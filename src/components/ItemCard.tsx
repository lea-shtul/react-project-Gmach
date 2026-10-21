import { Link } from "react-router-dom";
import type { Item } from "../types/itemType"
import '../style/item.css'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllMeta } from "../server/metaApi";
import { deletItemByIdMine } from "../server/itemApis";
import { Button, Stack, Card, CardActionArea, CardContent, Chip, Typography, Dialog, DialogContent, DialogTitle, DialogContentText, DialogActions } from '@mui/material'
import { useState } from "react";
// import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
// import StarIcon from '@mui/icons-material/Star';

type ItemCardProps = {
    item: Item;
    showActions?: boolean;
};

const ItemCard = ({ item, showActions }: ItemCardProps) => {

    const [confirmOpen, setConfirmOpen] = useState(false);

    const { data: meta } = useQuery({
        queryKey: ['meta'],
        queryFn: getAllMeta,
        staleTime: Infinity,
    });
    const queryClient = useQueryClient();
    const deleteMutation = useMutation({
        mutationFn: deletItemByIdMine,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
            queryClient.invalidateQueries({ queryKey: ['stats'] });
            setConfirmOpen(false);
        }
    })

    return (
        <Card
            variant="outlined"
            sx={{
                height: '100%',
                transition: '0.2s',
                '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
            }}
        >
            <CardActionArea component={Link} to={`/items/${item.id}`}>
                <CardContent>
                    <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                        <Chip
                            label={meta?.categories.find((c) => c.value === item.category)?.label}
                            size="small"
                            color="primary"
                            variant="outlined"
                        />
                        {!item.isPublic && <Chip label="פרטי" size="small" />}
                    </Stack>
                    <Typography variant="h6" gutterBottom>{item.title}</Typography>

                    {item.description && (
                        <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                    )}

                    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mt: 1.5 }}>
                        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                            <Typography variant="body2">📍</Typography>
                            {/* <LocationOnOutlined fontSize="small" color="action" /> */}
                            <Typography variant="body2" color="text.secondary">{item.neighborhood}</Typography>
                        </Stack>

                        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                            {/* <StarIcon fontSize="small" color="action" /> */}
                            <Typography variant="body2">✨</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {meta?.conditions.find((c) => c.value === item.condition)?.label}
                            </Typography>
                        </Stack>
                    </Stack>

                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">{item.owner.fullName}</Typography>
                        <Chip
                            label={item.isAvailable ? 'זמין' : 'מושאל'}
                            size="small"
                            color={item.isAvailable ? 'success' : 'error'}
                        />
                    </Stack>
                </CardContent>
            </CardActionArea>
            {
                showActions && (
                    <Stack direction="row" spacing={1}>
                        <Button variant="outlined" component={Link} to={`/my-items/${item.id}/edit`}>
                            עריכה
                        </Button>
                        <Button variant="outlined" size="small" color="error" onClick={() => setConfirmOpen(true)}>
                            מחיקה
                        </Button>
                    </Stack>
                )
            }

            {deleteMutation.isError && <p className="error">לא ניתן למחוק פריט שנמצא בהשאלה</p>}

            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>למחוק את "{item.title}"?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        הפריט יימחק לצמיתות, ולא ניתן יהיה לשחזר אותו.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>ביטול</Button>
                    <Button
                        color="error"
                        variant="contained"
                        disabled={deleteMutation.isPending}
                        onClick={() => deleteMutation.mutate(item.id)}
                    >
                        {deleteMutation.isPending ? 'מוחקת...' : 'מחיקה'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Card >
    );
};

export default ItemCard;

