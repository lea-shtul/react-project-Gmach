import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import { Link } from "react-router-dom"
import { userContext } from "../context/userContext"
import { getRecievedRequests } from "../server/requests"
import ReceivedRequestCard from "../components/ReceivedRequestCard"
import PageHeader from "../components/PageHeader"
import EmptyState from "../components/EmptyState"
import { Box, Stack, Button, Alert, CircularProgress } from "@mui/material"
import InboxIcon from "@mui/icons-material/Inbox"


const ReceivedRequests=()=>{
const {user}=useContext(userContext)

const {data:requests,isError,isLoading}=useQuery({
queryKey:['receivedRequests',user?.id],
queryFn: getRecievedRequests,
})


if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
        <CircularProgress />
    </Box>
);

if (isError) return <Alert severity="error">אירעה שגיאה בהצגת הבקשות</Alert>;
if (!requests) return null;

return (
  <Box>
    <PageHeader title="בקשות שקיבלתי" subtitle="בקשות השאלה שקיבלת על הפריטים שלך" />

    {requests.length === 0 ? (
      <EmptyState
        icon={<InboxIcon sx={{ fontSize: 56 }} />}
        title="עוד לא קיבלת בקשות"
        text="כשמישהי תשלח בקשה על אחד הפריטים שלך, היא תופיע כאן"
        action={<Button component={Link} to="/my-items" variant="outlined">לפריטים שלי</Button>}
      />
    ) : (
      <Stack spacing={2}>
        {requests.map((r) => <ReceivedRequestCard key={r.id} request={r} />)}
      </Stack>
    )}
  </Box>
)

}
export default ReceivedRequests