import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { LoanRequest, RequestStatus } from '../types/requestType';
import { getAllMeta } from '../server/metaApi';
import { updateRequestStatus } from '../server/requests';
import { Box, Card, CardContent, Stack, Typography, Chip, Button, Alert } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PhoneIcon from '@mui/icons-material/Phone';

type RequestCardProps = {
    request: LoanRequest;
};

const formatDate = (date: string) => new Date(date).toLocaleDateString('he-IL');

const statusColor: Record<RequestStatus, 'warning' | 'success' | 'info' | 'default' | 'error'> = {
    PENDING: 'warning',
    APPROVED: 'success',
    BORROWED: 'info',
    RETURNED: 'default',
    REJECTED: 'error',
    CANCELLED: 'default',
};

const ReceivedRequestCard = ({ request }: RequestCardProps) => {
    const { data: meta } = useQuery({
        queryKey: ['meta'],
        queryFn: getAllMeta,
        staleTime: Infinity
    });

    const queryClient = useQueryClient();

    const statusMutation = useMutation({
        mutationFn: (status: RequestStatus) => updateRequestStatus(request.id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['receivedRequests'] });
            queryClient.invalidateQueries({ queryKey: ['items'] });
            queryClient.invalidateQueries({ queryKey: ['item'] });
            queryClient.invalidateQueries({ queryKey: ['stats'] });

        },
    });

    const statusLabel = meta?.statuses.find((s) => s.value === request.status)?.label;
    const isPending = statusMutation.isPending;

    return (
        <Card variant="outlined">
            <CardContent>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{request.item.title}</Typography>
                    <Chip label={statusLabel} size="small" color={statusColor[request.status]} />
                </Stack>

                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mt: 1 }}>
                    <CalendarTodayIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                        {formatDate(request.startDate)} – {formatDate(request.endDate)}
                    </Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    מבקשת: {request.borrower.fullName} ({request.borrower.neighborhood})
                </Typography>

                {request.borrower.phone && (
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mt: 0.5 }}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{request.borrower.phone}</Typography>
                    </Stack>
                )}

                {request.message && (
                    <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                        "{request.message}"
                    </Typography>
                )}

                <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                    {request.status === 'PENDING' && (
                        <>
                            <Button
                                variant="contained"
                                color="success"
                                size="small"
                                disabled={isPending}
                                onClick={() => statusMutation.mutate('APPROVED')}
                            >
                                אישור
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                disabled={isPending}
                                onClick={() => statusMutation.mutate('REJECTED')}
                            >
                                דחייה
                            </Button>
                        </>
                    )}

                    {request.status === 'APPROVED' && (
                        <Button
                            variant="contained"
                            size="small"
                            disabled={isPending}
                            onClick={() => statusMutation.mutate('BORROWED')}
                        >
                            הפריט נמסר
                        </Button>
                    )}

                    {request.status === 'BORROWED' && (
                        <Button
                            variant="contained"
                            size="small"
                            disabled={isPending}
                            onClick={() => statusMutation.mutate('RETURNED')}
                        >
                            הפריט הוחזר
                        </Button>
                    )}
                </Stack>

                {statusMutation.isError && (
                    <Box sx={{ mt: 1.5 }}>
                        <Alert severity="error">לא ניתן לעדכן את הבקשה, נסי שוב יותר מאוחר.</Alert>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default ReceivedRequestCard;