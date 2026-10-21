import { useQuery } from '@tanstack/react-query';
import type { LoanRequest } from '../types/requestType';
import { getAllMeta } from '../server/metaApi';
import '../style/requestCard.css';
import { updateRequestStatus } from '../server/requests';
import { useMutation, useQueryClient } from '@tanstack/react-query';


type RequestCardProps = {
    request: LoanRequest;
};

const formatDate = (date: string) => new Date(date).toLocaleDateString('he-IL');

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
        <div className="request-card">
            <div className="request-card__top">
                <h3 className="request-card__title">{request.item.title}</h3>
                <span className={`request-status request-status--${request.status.toLowerCase()}`}>
                    {statusLabel}
                </span>
            </div>

            <p className="request-card__dates">
                📅 {formatDate(request.startDate)} – {formatDate(request.endDate)}
            </p>

            <p className="request-card__owner">ביקשתי מ: {request.owner.fullName}</p>

            {request.owner.phone && (
                <p className="request-card__phone">📞 {request.owner.phone}</p>
            )}

            {request.message && (
                <p className="request-card__message">"{request.message}"</p>
            )}

            {request.status === 'PENDING' && (
                <button onClick={() => cancelMutation.mutate()} disabled={cancelMutation.isPending}>
                    {cancelMutation.isPending ? 'מבטלת...' : 'ביטול בקשה'}
                </button>
            )}
        </div>
    )
}

export default RequestCard;