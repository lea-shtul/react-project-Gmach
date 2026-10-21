import { useQuery } from '@tanstack/react-query';
import type { LoanRequest, RequestStatus } from '../types/requestType';
import { getAllMeta } from '../server/metaApi';
import { updateRequestStatus } from '../server/requests';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Card, CardContent, Stack, Typography, Chip, Button } from '@mui/material';
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
                    ביקשתי מ: {request.owner.fullName}
                </Typography>

                {request.owner.phone && (
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mt: 0.5 }}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{request.owner.phone}</Typography>
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
        </Card>
    )
}

export default RequestCard;