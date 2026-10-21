import { useQuery } from '@tanstack/react-query';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { getAllMeta } from '../server/metaApi';
import { getAdminStats } from '../server/statsApi';
import '../style/stats.css';
import { getAdminUsers } from '../server/getUsers';
import { Box, CircularProgress } from '@mui/material';


const STATUS_COLORS: Record<string, string> = {
    PENDING: '#f59e0b',
    APPROVED: '#16a34a',
    BORROWED: '#3b82f6',
    RETURNED: '#9ca3af',
    REJECTED: '#ef4444',
    CANCELLED: '#d1d5db',
};

const formatMonth = (month: string) =>
    new Date(month + '-01').toLocaleDateString('he-IL', { month: 'short' });

const AdminDashboard = () => {
    const { data: meta } = useQuery({
        queryKey: ['meta'],
        queryFn: getAllMeta,
        staleTime: Infinity,
    });

    const { data: stats, isLoading, isError } = useQuery({
        queryKey: ['stats', 'admin'],
        queryFn: getAdminStats,
    });

    const { data: users } = useQuery({
        queryKey: ['stats', 'admin', 'users'],
        queryFn: getAdminUsers,
    });

    if (isLoading) return<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
  <CircularProgress />
</Box>
    if (isError) return <p>אירעה שגיאה בטעינת הנתונים</p>;
    if (!stats) return null;

    const categoryData = stats.byCategory.map((c) => ({
        ...c,
        label: meta?.categories.find((m) => m.value === c.category)?.label ?? c.category,
    }));

    const statusData = stats.byStatus.map((s) => ({
        ...s,
        label: meta?.statuses.find((m) => m.value === s.status)?.label ?? s.status,
    }));
    // שתי הפונקציות הנל לוקחות את הסטטוס/קטגוריה לפי כל אובייקט ומוסיפות לו את הערך שלו בעברית מהMETA


    const { totals } = stats;

    return (
        <div className="stats">
            <h2>לוח בקרה</h2>

            <div className="stats__cards">
                <div className="stat-card">
                    <span className="stat-card__number">{totals.users}</span>
                    <span className="stat-card__label">משתמשות רשומות</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card__number">{totals.items}</span>
                    <span className="stat-card__label">פריטים באתר</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card__number">{totals.activeLoans}</span>
                    <span className="stat-card__label">השאלות פעילות</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card__number">{totals.pendingRequests}</span>
                    <span className="stat-card__label">בקשות ממתינות</span>
                </div>
            </div>

            <div className="stats__box">
                <h3>פריטים ובקשות לפי קטגוריה</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryData}>
                        <XAxis dataKey="label" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="items" name="פריטים" fill="#4338ca" />
                        <Bar dataKey="requests" name="בקשות" fill="#f59e0b" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="stats__row">
                <div className="stats__box">
                    <h3>בקשות לפי חודש</h3>
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={stats.monthlyRequests}>
                            <XAxis dataKey="month" tickFormatter={formatMonth} />
                            <YAxis allowDecimals={false} />
                            <Tooltip labelFormatter={(label) => formatMonth(String(label))} />
                            <Line type="monotone" dataKey="count" name="בקשות" stroke="#4338ca" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="stats__box">
                    <h3>בקשות לפי סטטוס</h3>
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie data={statusData} dataKey="count" nameKey="label" outerRadius={95}>
                                {statusData.map((s) => (
                                    <Cell key={s.status} fill={STATUS_COLORS[s.status] ?? '#9ca3af'} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {users && (
                <div className="stats__box">
                    <h3>משתמשות ({users.length})</h3>
                    <div className="table-wrapper">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>שם</th>
                                    <th>אימייל</th>
                                    <th>טלפון</th>
                                    <th>שכונה</th>
                                    <th>פריטים</th>
                                    <th>בקשות</th>
                                    <th>הצטרפה</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id}>
                                        <td>
                                            {u.fullName}
                                            {u.role === 'ADMIN' && <span className="badge badge--category"> מנהלת</span>}
                                        </td>
                                        <td>{u.email}</td>
                                        <td>{u.phone}</td>
                                        <td>{u.neighborhood}</td>
                                        <td>{u.itemsCount}</td>
                                        <td>{u.requestsCount}</td>
                                        <td>{new Date(u.createdAt).toLocaleDateString('he-IL')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;