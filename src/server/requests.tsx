import type { requestItem } from "../types/itemType"
import type { LoanRequest, RequestStatus } from "../types/requestType"
import { api } from "./axios"




export const createRequest = async (request: requestItem) => {
    const res = await api.post('requests', request)
    return res.data

}

export const getMyRequests=async()=>{
const res=await api.get<LoanRequest[]>('requests/mine')
return res.data
}


export const getRecievedRequests=async()=>{
    const res=await api.get<LoanRequest[]>('requests/received')
    return res.data
}

export const updateRequestStatus = async (id: string, status: RequestStatus) => {
  const res = await api.patch<LoanRequest>(`/requests/${id}/status`, { status });
  return res.data;
};