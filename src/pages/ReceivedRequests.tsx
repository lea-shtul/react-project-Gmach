import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import { userContext } from "../context/userContext"
import { getRecievedRequests } from "../server/requests"
import ReceivedRequestCard from "../components/ReceivedRequestCard"


const ReceivedRequests=()=>{
const {user}=useContext(userContext)

const {data:requests,isError,isLoading}=useQuery({
queryKey:['receivedRequests',user?.id],
queryFn: getRecievedRequests,
})


if(isLoading)return <p>בטעינה...</p>

if (isError) return <p>ארעה שגיאה בהצגת הבקשות</p>
if (!requests) return null;
if (requests.length === 0) return <p>עוד לא קבלתת בקשות </p>;
return (
  <div className="requests-list">
    {requests.map((r) => <ReceivedRequestCard key={r.id} request={r} />)}
  </div>
)

}
export default ReceivedRequests