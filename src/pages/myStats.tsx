
import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { userContext } from '../context/userContext';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getMyStats, getNeighborhoodStats } from '../server/statsApi';
import '../style/stats.css';

const formatDay = (date: string) =>
    new Date(date).toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' });


const MyStats = () => {
    const { user } = useContext(userContext);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['stats', 'me', user?.id],
        queryFn: getMyStats,
    });

    const { data: hood } = useQuery({
        queryKey: ['stats', 'neighborhood', user?.id],
        queryFn: getNeighborhoodStats,
    });

    if (isLoading) return <p>טוען...</p>;
    if (isError) return <p>אירעה שגיאה בטעינת הנתונים</p>;
    if (!data) return null;

    const { totals, topItem } = data;

    return (
        <div className="stats">
            <h2>ההשפעה שלי</h2>

            <div className="stats__cards">
                <div className="stat-card">
                    <span className="stat-card__number">{totals.myItemsCount}</span>
                    <span className="stat-card__label">פריטים שפרסמתי</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card__number">{totals.timesMyItemsLent}</span>
                    <span className="stat-card__label">פעמים שהשאלתי</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card__number">{totals.timesIBorrowed}</span>
                    <span className="stat-card__label">פעמים ששאלתי</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card__number">{totals.pendingReceived}</span>
                    <span className="stat-card__label">בקשות שמחכות לי</span>
                </div>
            </div>

            <div className="stats__box">
                <h3>הפריט הכי מבוקש שלי</h3>
                {topItem ? (
                    <p>
                        <Link to={`/items/${topItem.id}`}>{topItem.title}</Link> הושאל {topItem.count} פעמים 🏆
                    </p>
                ) : (
                    <p>עוד אין. כשאחד הפריטים שלך יושאל, הוא יופיע כאן.</p>
                )}
            </div>
{/* {כל החלק הזה אני לא ממש הבנתי נא לחזורר} */}
            <div className="stats__box">
                <h3>פעילות בחצי השנה האחרונה</h3>
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={data.monthly}>
                        <XAxis dataKey="month" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="lent" name="השאלתי" fill="#4338ca" />
                        <Bar dataKey="borrowed" name="שאלתי" fill="#16a34a" />
                    </BarChart>
                </ResponsiveContainer>
            </div>


            {hood && (
                <>
                    <h2>מה קורה בשכונה – {user?.neighborhood}</h2>

                    <div className="stats__cards">
                        <div className="stat-card">
                            <span className="stat-card__number">{hood.newItemsThisWeek}</span>
                            <span className="stat-card__label">פריטים חדשים השבוע</span>
                        </div>
                    </div>

                    <div className="stats__box">
                        <h3>השבוע האחרון</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={hood.daily}>
                                <XAxis dataKey="date" tickFormatter={formatDay} />
                                <YAxis allowDecimals={false} />
                                <Tooltip labelFormatter={(label) => formatDay(String(label))} />                                <Legend />
                                <Line type="monotone" dataKey="newItems" name="פריטים חדשים" stroke="#4338ca" />
                                <Line type="monotone" dataKey="newRequests" name="בקשות חדשות" stroke="#f59e0b" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="stats__box">
                        <h3>הכי מבוקשים השבוע 🔥</h3>
                        {hood.mostRequested.length === 0 ? (
                            <p>השבוע עוד לא היו בקשות בשכונה</p>
                        ) : (
                            <ol className="stats__list">
                                {hood.mostRequested.map(({ item, count }) => (
                                    <li key={item.id}>
                                        <Link to={`/items/${item.id}`}>{item.title}</Link> – {count} בקשות
                                    </li>
                                ))}
                            </ol>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default MyStats;