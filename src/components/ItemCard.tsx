import { Link } from "react-router-dom";
import type { Item } from "../types/itemType"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMeta } from '../hooks/useMeta';
import { deletItemByIdMine } from "../server/itemApis";
import { Alert, Box, Button, Stack, Card, CardActionArea, CardActions, CardContent, Chip, Typography, Dialog, DialogContent, DialogTitle, DialogContentText, DialogActions } from '@mui/material'
import { alpha } from '@mui/material/styles';
import { useState } from "react";
import { useSnackbar } from '../hooks/useSnackbar';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import KitchenIcon from '@mui/icons-material/Kitchen';
import CelebrationIcon from '@mui/icons-material/Celebration';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import BuildIcon from '@mui/icons-material/Build';
import CategoryIcon from '@mui/icons-material/Category';

type ItemCardProps = {
    item: Item;
    showActions?: boolean;
};

const CATEGORY_STYLE: Record<string, { color: string; icon: typeof CategoryIcon }> = {
    BABY: { color: '#ec4899', icon: ChildCareIcon },
    KITCHEN: { color: '#f97316', icon: KitchenIcon },
    EVENTS: { color: '#8b5cf6', icon: CelebrationIcon },
    BOOKS: { color: '#3b82f6', icon: MenuBookIcon },
    HOLIDAY: { color: '#ef4444', icon: CardGiftcardIcon },
    TOOLS: { color: '#64748b', icon: BuildIcon },
};
const DEFAULT_CATEGORY_STYLE = { color: '#6b7280', icon: CategoryIcon };

const ItemCard = ({ item, showActions }: ItemCardProps) => {

    const [confirmOpen, setConfirmOpen] = useState(false);

    const { getLabel } = useMeta();
    const { showMessage } = useSnackbar();
    const queryClient = useQueryClient();
    const deleteMutation = useMutation({
        mutationFn: deletItemByIdMine,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
            queryClient.invalidateQueries({ queryKey: ['stats'] });
            setConfirmOpen(false);
            showMessage('הפריט נמחק בהצלחה');
        }
    })

    const categoryLabel = getLabel('categories', item.category)
    const { color: categoryColor, icon: CategoryIconComp } = CATEGORY_STYLE[item.category] ?? DEFAULT_CATEGORY_STYLE;

    return (
        <Card
            variant="outlined"
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                transition: '0.2s',
                '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' },
            }}
        >
            <CardActionArea
                component={Link}
                to={`/items/${item.id}`}
                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
            >
                <Box
                    sx={{
                        bgcolor: alpha(categoryColor, 0.12),
                        color: categoryColor,
                        py: 2.5,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 0.5,
                    }}
                >
                    <CategoryIconComp sx={{ fontSize: 36 }} />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>{categoryLabel}</Typography>
                </Box>

                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {!item.isPublic && (
                        <Chip label="פרטי" size="small" sx={{ alignSelf: 'flex-start', mb: 1.5 }} />
                    )}
                    <Typography variant="h6" gutterBottom>{item.title}</Typography>

                    {item.description && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                            }}
                        >
                            {item.description}
                        </Typography>
                    )}

                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 1.5 }}>
                        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                            <LocationOnOutlined fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">{item.neighborhood}</Typography>
                        </Stack>

                        <Chip
                            label={getLabel('conditions', item.condition)}
                            size="small"
                            variant="outlined"
                        />
                    </Stack>

                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mt: 'auto', pt: 2 }}>
                        <Typography variant="body2" color="text.secondary">{item.owner.fullName}</Typography>
                        <Chip
                            label={item.isAvailable ? 'זמין' : 'מושאל'}
                            size="small"
                            color={item.isAvailable ? 'success' : 'default'}
                        />
                    </Stack>
                </CardContent>
            </CardActionArea>
            {
                showActions && (
                    <CardActions sx={{ gap: 1, px: 2, pb: 2 }}>
                        <Button variant="outlined" size="small" component={Link} to={`/my-items/${item.id}/edit`}>
                            עריכה
                        </Button>
                        <Button variant="outlined" size="small" color="error" onClick={() => setConfirmOpen(true)}>
                            מחיקה
                        </Button>
                    </CardActions>
                )
            }

            {deleteMutation.isError && <Alert severity="error" sx={{ m: 1 }}>לא ניתן למחוק פריט שנמצא בהשאלה</Alert>}

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

