import { useQuery } from "@tanstack/react-query"
import { getMyRequests } from "../server/requests"
import { useContext } from "react";
import { Link } from "react-router-dom";
import { userContext } from "../context/userContext";
import RequestCard from "../components/requestCard";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import { Box, Stack, Button, Alert, CircularProgress } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";


const MyRequests = () => {

const {user}=useContext(userContext)


 const { data: requests,isError,isLoading } = useQuery({
     queryKey: ['myRequests',user?.id],
     queryFn: getMyRequests,
    //  staleTime: Infinity,
   });


if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
        <CircularProgress />
    </Box>
);

if (isError) return <Alert severity="error">אירעה שגיאה בהצגת הבקשות</Alert>;
if (!requests) return null;

return (
  <Box>
    <PageHeader title="הבקשות שלי" subtitle="בקשות ההשאלה ששלחת לשכנות" />

    {requests.length === 0 ? (
      <EmptyState
        icon={<InboxIcon sx={{ fontSize: 56 }} />}
        title="עוד לא שלחת בקשות"
        text="כשתמצאי פריט שמתאים לך, אפשר לשלוח בקשת השאלה מתוך דף הפריט"
        action={<Button component={Link} to="/" variant="outlined">לרשימת הפריטים</Button>}
      />
    ) : (
      <Stack spacing={2}>
        {requests.map((r) => <RequestCard key={r.id} request={r} />)}
      </Stack>
    )}
  </Box>
)

}

export default MyRequests