import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import { userContext } from "../context/userContext"
import { getRecievedRequests } from "../server/requests"
import ReceivedRequestCard from "../components/ReceivedRequestCard"
import { Box, Stack, Typography, Alert, CircularProgress } from "@mui/material"


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

if (isError) return <Alert severity="error">ארעה שגיאה בהצגת הבקשות</Alert>;
if (!requests) return null;
if (requests.length === 0) return <Typography color="text.secondary">עוד לא קבלתת בקשות </Typography>;
return (
  <Stack spacing={2}>
    {requests.map((r) => <ReceivedRequestCard key={r.id} request={r} />)}
  </Stack>
)

}
export default ReceivedRequests