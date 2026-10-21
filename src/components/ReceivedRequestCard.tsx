import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { LoanRequest, RequestStatus } from '../types/requestType';
import { getAllMeta } from '../server/metaApi';
import { updateRequestStatus } from '../server/requests';
import '../style/requestCard.css';

type RequestCardProps = {
    request: LoanRequest;
};

const formatDate = (date: string) => new Date(date).toLocaleDateString('he-IL');

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

            <p className="request-card__owner">
                מבקשת: {request.borrower.fullName} ({request.borrower.neighborhood})
            </p>

            {request.borrower.phone && (
                <p className="request-card__phone">📞 {request.borrower.phone}</p>
            )}

            {request.message && (
                <p className="request-card__message">"{request.message}"</p>
            )}

            <div className="request-card__actions">
                {request.status === 'PENDING' && (
                    <>
                        <button
                            className="btn btn--approve"
                            disabled={isPending}
                            onClick={() => statusMutation.mutate('APPROVED')}
                        >
                            אישור
                        </button>
                        <button
                            className="btn btn--reject"
                            disabled={isPending}
                            onClick={() => statusMutation.mutate('REJECTED')}
                        >
                            דחייה
                        </button>
                    </>
                )}

                {request.status === 'APPROVED' && (
                    <button
                        className="btn btn--primary"
                        disabled={isPending}
                        onClick={() => statusMutation.mutate('BORROWED')}
                    >
                        הפריט נמסר
                    </button>
                )}

                {request.status === 'BORROWED' && (
                    <button
                        className="btn btn--primary"
                        disabled={isPending}
                        onClick={() => statusMutation.mutate('RETURNED')}
                    >
                        הפריט הוחזר
                    </button>
                )}
            </div>

            {statusMutation.isError && (
                <p className="error">לא ניתן לעדכן את הבקשה נסה שוב יותר מאוחר .</p>
            )}
        </div>
    );
};

export default ReceivedRequestCard;