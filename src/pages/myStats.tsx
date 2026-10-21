
import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';
import { userContext } from '../context/userContext';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getMyStats, getNeighborhoodStats } from '../server/statsApi';
import {
    Box, Paper, Stack, Typography, Link, Alert, CircularProgress,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';

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

    if (isLoading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
            <CircularProgress />
        </Box>
    );
    if (isError) return <Alert severity="error">אירעה שגיאה בטעינת הנתונים</Alert>;
    if (!data) return null;

    const { totals, topItem } = data;

    const statCards = [
        { number: totals.myItemsCount, label: 'פריטים שפרסמתי' },
        { number: totals.timesMyItemsLent, label: 'פעמים שהשאלתי' },
        { number: totals.timesIBorrowed, label: 'פעמים ששאלתי' },
        { number: totals.pendingReceived, label: 'בקשות שמחכות לי' },
    ];

    return (
        <Stack spacing={3}>
            <PageHeader title="ההשפעה שלי" subtitle={'סיכום הפעילות וההשפעה שלך בגמ"ח'} />

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 1.5 }}>
                {statCards.map(({ number, label }) => (
                    <Paper key={label} variant="outlined" sx={{ p: 2.5, textAlign: 'center' }}>
                        <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>{number}</Typography>
                        <Typography variant="body2" color="text.secondary">{label}</Typography>
                    </Paper>
                ))}
            </Box>

            <Paper variant="outlined" sx={{ p: 2.5 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>הפריט הכי מבוקש שלי</Typography>
                {topItem ? (
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                        <Typography color="text.secondary">
                            <Link component={RouterLink} to={`/items/${topItem.id}`}>{topItem.title}</Link> הושאל {topItem.count} פעמים
                        </Typography>
                        <EmojiEventsIcon fontSize="small" color="warning" />
                    </Stack>
                ) : (
                    <EmptyState
                        icon={<EmojiEventsIcon sx={{ fontSize: 40 }} />}
                        title="עוד אין פריט מוביל"
                        text="כשאחד הפריטים שלך יושאל, הוא יופיע כאן"
                    />
                )}
            </Paper>
            {/* {כל החלק הזה אני לא ממש הבנתי נא לחזורר} */}
            <Paper variant="outlined" sx={{ p: 2.5 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>פעילות בחצי השנה האחרונה</Typography>
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
            </Paper>

            {hood && (
                <>
                    <Typography variant="h5">מה קורה בשכונה – {user?.neighborhood}</Typography>

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 1.5 }}>
                        <Paper variant="outlined" sx={{ p: 2.5, textAlign: 'center' }}>
                            <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>{hood.newItemsThisWeek}</Typography>
                            <Typography variant="body2" color="text.secondary">פריטים חדשים השבוע</Typography>
                        </Paper>
                    </Box>

                    <Paper variant="outlined" sx={{ p: 2.5 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>השבוע האחרון</Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={hood.daily}>
                                <XAxis dataKey="date" tickFormatter={formatDay} />
                                <YAxis allowDecimals={false} />
                                <Tooltip labelFormatter={(label) => formatDay(String(label))} />                                <Legend />
                                <Line type="monotone" dataKey="newItems" name="פריטים חדשים" stroke="#4338ca" />
                                <Line type="monotone" dataKey="newRequests" name="בקשות חדשות" stroke="#f59e0b" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>

                    <Paper variant="outlined" sx={{ p: 2.5 }}>
                        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6">הכי מבוקשים השבוע</Typography>
                            <WhatshotIcon fontSize="small" color="error" />
                        </Stack>
                        {hood.mostRequested.length === 0 ? (
                            <EmptyState
                                icon={<TrendingFlatIcon sx={{ fontSize: 40 }} />}
                                title="השבוע עוד לא היו בקשות בשכונה"
                            />
                        ) : (
                            <Box component="ol" sx={{ m: 0, pl: 2.5, color: 'text.secondary' }}>
                                {hood.mostRequested.map(({ item, count }) => (
                                    <Box component="li" key={item.id} sx={{ mb: 0.5 }}>
                                        <Link component={RouterLink} to={`/items/${item.id}`}>{item.title}</Link> – {count} בקשות
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Paper>
                </>
            )}
        </Stack>
    );
};

export default MyStats;