import { useQuery } from "@tanstack/react-query"
import { getMyRequests } from "../server/requests"
import { useContext } from "react";
import { userContext } from "../context/userContext";
import RequestCard from "../components/requestCard";
import { Box, Stack, Typography, Alert, CircularProgress } from "@mui/material";


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
if (requests.length === 0) return <Typography color="text.secondary">עוד לא שלחת בקשות</Typography>;
return (
  <Stack spacing={2}>
    {requests.map((r) => <RequestCard key={r.id} request={r} />)}
  </Stack>
)

}

export default MyRequests