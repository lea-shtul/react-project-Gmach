import type { ReactElement } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { getAdminStats } from '../server/statsApi';
import { getAdminUsers } from '../server/getUsers';
import {
    Box, Paper, Stack, Typography, Chip, Alert, CircularProgress,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import PageHeader from '../components/PageHeader';
import StatCard, { type StatColor } from '../components/StatCard';
import { useMeta } from '../hooks/useMeta';


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

   const {getLabel} = useMeta();

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
    if (isError) return <Alert severity="error">אירעה שגיאה בטעינת הנתונים</Alert>;
    if (!stats) return null;

    const categoryData = stats.byCategory.map((c) => ({
        ...c,
        label: getLabel("categories",c.category),
    }));

    const statusData = stats.byStatus.map((s) => ({
        ...s,
        label: getLabel("statuses", s.status) ?? s.status,
    }));
    // שתי הפונקציות הנל לוקחות את הסטטוס/קטגוריה לפי כל אובייקט ומוסיפות לו את הערך שלו בעברית מהMETA


    const { totals } = stats;

    const statCards: { number: number; label: string; icon: ReactElement; color: StatColor }[] = [
        { number: totals.users, label: 'משתמשות רשומות', icon: <PeopleAltIcon />, color: 'primary' },
        { number: totals.items, label: 'פריטים באתר', icon: <Inventory2Icon />, color: 'info' },
        { number: totals.activeLoans, label: 'השאלות פעילות', icon: <SwapHorizIcon />, color: 'success' },
        { number: totals.pendingRequests, label: 'בקשות ממתינות', icon: <PendingActionsIcon />, color: 'warning' },
    ];

    return (
        <Box >
        <Stack spacing={3}>
            <PageHeader title="לוח בקרה" subtitle="נתוני המערכת והמשתמשות הרשומות" />

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 1.5 }}>
                {statCards.map(({ number, label, icon, color }) => (
                    <StatCard key={label} number={number} label={label} icon={icon} color={color} />
                ))}
            </Box>

            <Paper variant="outlined" sx={{ p: 2.5 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>פריטים ובקשות לפי קטגוריה</Typography>
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
            </Paper>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
                <Paper variant="outlined" sx={{ p: 2.5 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>בקשות לפי חודש</Typography>
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={stats.monthlyRequests}>
                            <XAxis dataKey="month" tickFormatter={formatMonth} />
                            <YAxis allowDecimals={false} />
                            <Tooltip labelFormatter={(label) => formatMonth(String(label))} />
                            <Line type="monotone" dataKey="count" name="בקשות" stroke="#4338ca" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </Paper>

                <Paper variant="outlined" sx={{ p: 2.5 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>בקשות לפי סטטוס</Typography>
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
                </Paper>
            </Box>

            {users && (
                <Paper variant="outlined" sx={{ p: 2.5 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>משתמשות ({users.length})</Typography>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>שם</TableCell>
                                    <TableCell>אימייל</TableCell>
                                    <TableCell>טלפון</TableCell>
                                    <TableCell>שכונה</TableCell>
                                    <TableCell>פריטים</TableCell>
                                    <TableCell>בקשות</TableCell>
                                    <TableCell>הצטרפה</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((u) => (
                                    <TableRow key={u.id} hover>
                                        <TableCell>
                                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                                <span>{u.fullName}</span>
                                                {u.role === 'ADMIN' && (
                                                    <Chip label="מנהלת" size="small" color="primary" variant="outlined" />
                                                )}
                                            </Stack>
                                        </TableCell>
                                        <TableCell>{u.email}</TableCell>
                                        <TableCell>{u.phone}</TableCell>
                                        <TableCell>{u.neighborhood}</TableCell>
                                        <TableCell>{u.itemsCount}</TableCell>
                                        <TableCell>{u.requestsCount}</TableCell>
                                        <TableCell>{new Date(u.createdAt).toLocaleDateString('he-IL')}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}
        </Stack>
        </Box>
    );
};

export default AdminDashboard;