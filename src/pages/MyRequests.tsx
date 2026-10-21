import { useQuery } from "@tanstack/react-query"
import { getMyRequests } from "../server/requests"
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { userContext } from "../context/userContext";
import RequestCard from "../components/requestCard";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import type { LoanRequest, RequestStatus } from "../types/requestType";
import { Box, Stack, Tabs, Tab, Button, Alert, Skeleton } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

type TabKey = 'pending' | 'active' | 'history';

const TAB_STATUSES: Record<TabKey, RequestStatus[]> = {
    pending: ['PENDING'],
    active: ['APPROVED', 'BORROWED'],
    history: ['RETURNED', 'REJECTED', 'CANCELLED'],
};

const TAB_LABELS: Record<TabKey, string> = {
    pending: 'ממתינות',
    active: 'פעילות',
    history: 'היסטוריה',
};

const TAB_EMPTY_TEXT: Record<TabKey, string> = {
    pending: 'אין בקשות שממתינות לאישור',
    active: 'אין בקשות פעילות כרגע',
    history: 'עדיין אין היסטוריית בקשות',
};

const countByTab = (requests: LoanRequest[], tab: TabKey) =>
    requests.filter((r) => TAB_STATUSES[tab].includes(r.status)).length;

const MyRequests = () => {

const {user}=useContext(userContext)
const [tab, setTab] = useState<TabKey>('pending');


 const { data: requests,isError,isLoading } = useQuery({
     queryKey: ['myRequests',user?.id],
     queryFn: getMyRequests,
    //  staleTime: Infinity,
   });


if (isLoading) return (
    <Stack spacing={2}>
        {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={120} />
        ))}
    </Stack>
);

if (isError) return <Alert severity="error">אירעה שגיאה בהצגת הבקשות</Alert>;
if (!requests) return null;

if (requests.length === 0) {
  return (
    <Box>
      <PageHeader title="הבקשות שלי" subtitle="בקשות ההשאלה ששלחת לשכנות" />
      <EmptyState
        icon={<InboxIcon sx={{ fontSize: 56 }} />}
        title="עוד לא שלחת בקשות"
        text="כשתמצאי פריט שמתאים לך, אפשר לשלוח בקשת השאלה מתוך דף הפריט"
        action={<Button component={Link} to="/" variant="outlined">לרשימת הפריטים</Button>}
      />
    </Box>
  );
}

const visibleRequests = requests.filter((r) => TAB_STATUSES[tab].includes(r.status));

return (
  <Box>
    <PageHeader title="הבקשות שלי" subtitle="בקשות ההשאלה ששלחת לשכנות" />

    <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ mb: 2 }}>
      {(Object.keys(TAB_LABELS) as TabKey[]).map((key) => (
        <Tab key={key} value={key} label={`${TAB_LABELS[key]} (${countByTab(requests, key)})`} />
      ))}
    </Tabs>

    {visibleRequests.length === 0 ? (
      <EmptyState icon={<InboxIcon sx={{ fontSize: 48 }} />} title={TAB_EMPTY_TEXT[tab]} />
    ) : (
      <Stack spacing={2}>
        {visibleRequests.map((r) => <RequestCard key={r.id} request={r} />)}
      </Stack>
    )}
  </Box>
)

}

export default MyRequests