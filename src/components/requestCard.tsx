import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';
import type { LoanRequest, RequestStatus } from '../types/requestType';
import { getAllMeta } from '../server/metaApi';
import { updateRequestStatus } from '../server/requests';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert, Box, Card, CardContent, Stack, Typography, Chip, Button, Link, Snackbar } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';


type RequestCardProps = {
    request: LoanRequest;
};

const formatDate = (date: string) => new Date(date).toLocaleDateString('he-IL');

const toWhatsAppNumber = (phone: string) => phone.replace(/\D/g, '').replace(/^0/, '972');

const statusColor: Record<RequestStatus, 'warning' | 'success' | 'info' | 'default' | 'error'> = {
    PENDING: 'warning',
    APPROVED: 'success',
    BORROWED: 'info',
    RETURNED: 'default',
    REJECTED: 'error',
    CANCELLED: 'default',
};

const statusBarColor: Record<RequestStatus, string> = {
    PENDING: 'warning.main',
    APPROVED: 'success.main',
    BORROWED: 'info.main',
    RETURNED: 'grey.400',
    REJECTED: 'error.main',
    CANCELLED: 'grey.400',
};

const RequestCard = ({ request }: RequestCardProps) => {

    const { data: meta } = useQuery({
        queryKey: ['meta'],
        queryFn: getAllMeta,
        staleTime: Infinity,
    });
    const queryClient = useQueryClient();

    const cancelMutation = useMutation({
        mutationFn: () => updateRequestStatus(request.id, 'CANCELLED'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myRequests'] });
            queryClient.invalidateQueries({ queryKey: ['stats'] });
        },
    });

    const statusLabel = meta?.statuses.find((s) => s.value === request.status)?.label;

    return (
        <Card
            variant="outlined"
            sx={{
                borderInlineStartWidth: 4,
                borderInlineStartStyle: 'solid',
                borderInlineStartColor: statusBarColor[request.status],
            }}
        >
            <CardContent>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                    <Link component={RouterLink} to={`/items/${request.item.id}`} sx={{ fontWeight: 600 }}>
                        {request.item.title}
                    </Link>
                    <Chip label={statusLabel} size="small" color={statusColor[request.status]} />
                </Stack>

                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mt: 1 }}>
                    <CalendarTodayIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                        {formatDate(request.startDate)} – {formatDate(request.endDate)}
                    </Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    ביקשתי מ: {request.owner.fullName}
                </Typography>

                {request.owner.phone && (
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 0.5 }}>
                        <Stack
                            direction="row"
                            spacing={0.5}
                            component="a"
                            href={`tel:${request.owner.phone}`}
                            sx={{ alignItems: 'center', color: 'text.primary', textDecoration: 'none' }}
                        >
                            <PhoneIcon fontSize="small" color="action" />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{request.owner.phone}</Typography>
                        </Stack>
                        <Link
                            href={`https://wa.me/${toWhatsAppNumber(request.owner.phone)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}
                        >
                            <WhatsAppIcon fontSize="small" />
                        </Link>
                    </Stack>
                )}

                {request.message && (
                    <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                        "{request.message}"
                    </Typography>
                )}

                {request.status === 'PENDING' && (
                    <Box sx={{ mt: 1.5 }}>
                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => cancelMutation.mutate()}
                            disabled={cancelMutation.isPending}
                        >
                            {cancelMutation.isPending ? 'מבטלת...' : 'ביטול בקשה'}
                        </Button>
                    </Box>
                )}
            </CardContent>

            <Snackbar
                open={cancelMutation.isSuccess}
                autoHideDuration={3000}
                onClose={() => cancelMutation.reset()}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity="success" variant="filled" onClose={() => cancelMutation.reset()}>
                    הבקשה בוטלה
                </Alert>
            </Snackbar>
        </Card>
    )
}

export default RequestCard;