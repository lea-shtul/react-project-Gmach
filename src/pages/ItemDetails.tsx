import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "react-router-dom"
import type { Item } from "../types/itemType"
import { getItemById } from "../server/itemApis"
import { getAllMeta } from "../server/metaApi"
import '../style/item.css'
import { useContext } from "react"
import { userContext } from "../context/userContext"
import RequestForm from "../components/requesrForm"



const ItemDetails = () => {
    const { id } = useParams();

    const { data: item, isLoading, isError } = useQuery<Item>({
        queryKey: ['item', id],
        queryFn: () => getItemById(id!),
    });

    const { data: meta } = useQuery({
        queryKey: ['meta'],
        queryFn: getAllMeta,
        staleTime: Infinity// כדי שיקרא את זה מהקאש, רק בפעם הראשונה שהאתר עולה אז היה באמת קריאה מהשרת
    });
    const { user } = useContext(userContext);
    const isOwner = user?.id == item?.ownerId
    const isAdmin = user?.role == "ADMIN"

    if (isLoading) return <p>טוען...</p>
    if (isError) return <p>הפריט לא נמצא</p>
    if (!item) return null;

    const categoryLabel = meta?.categories.find((c) => c.value === item.category)?.label;
    const conditionLabel = meta?.conditions.find((c) => c.value === item.condition)?.label;



    return (
        <div className="details">
            <Link to="/" className="details__back">→ חזרה לרשימה</Link>

            <div className="details__card">
                <div className="details__badges">
                    <span className="badge badge--category">{categoryLabel}</span>
                    {!item.isPublic && <span className="badge badge--private">פרטי</span>}
                    <span className={item.isAvailable ? 'status status--available' : 'status status--unavailable'}>
                        {item.isAvailable ? 'זמין להשאלה' : 'מושאל כרגע'}
                    </span>
                </div>

                <h1 className="details__title">{item.title}</h1>

                {item.description && <p className="details__description">{item.description}</p>}

                <dl className="details__info">
                    <div>
                        <dt>מצב</dt>
                        <dd>{conditionLabel}</dd>
                    </div>
                    <div>
                        <dt>שכונה</dt>
                        <dd>{item.neighborhood}</dd>
                    </div>
                    <div>
                        <dt>מפרסמת</dt>
                        <dd>{item.owner.fullName}</dd>
                    </div>
                    <div>
                        <dt>פורסם בתאריך</dt>
                        <dd>{new Date(item.createdAt).toLocaleDateString('he-IL')}</dd>
                    </div>
                </dl>

                <div className="details__actions">
                    {isOwner ? (
                        <Link to={`/my-items/${item.id}/edit`} className="btn btn--primary">
                            עריכת הפריט
                        </Link>
                    ) : item.isAvailable ? (
                        <RequestForm itemId={item.id} />
                    ) : (
                        <p>הפריט מושאל כרגע. אפשר לחזור מאוחר יותר</p>
                    )}
                </div>
            </div>
        </div>
    );
};




export default ItemDetails