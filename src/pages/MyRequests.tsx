import { useQuery } from "@tanstack/react-query"
import { getMyRequests } from "../server/requests"
import { useContext } from "react";
import { userContext } from "../context/userContext";
import RequestCard from "../components/requestCard";


const MyRequests = () => {

const {user}=useContext(userContext)


 const { data: requests,isError,isLoading } = useQuery({
     queryKey: ['myRequests',user?.id],
     queryFn: getMyRequests,
    //  staleTime: Infinity,
   });


if(isLoading)return <p>בטעינה...</p>

if (isError) return <p>ארעה שגיאה בהצגת הבקשות</p>
if (!requests) return null;
if (requests.length === 0) return <p>עוד לא שלחת בקשות</p>;
return (
  <div className="requests-list">
    {requests.map((r) => <RequestCard key={r.id} request={r} />)}
  </div>
)

}

export default MyRequests