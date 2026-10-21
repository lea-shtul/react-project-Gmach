
import type { newItem } from "../types/itemType"
import { api } from "./axios"

export const getAllItems = async () => {

    const res = await api.get("/items")
    return res.data


}


export const getItemById = async (id: string) => {


    const res = await api.get('/items/' + id)
    return res.data
}


export const getMyItems=async()=>{

    const res=await api.get('items?mine=true')
    return res.data
}


export const deletItemByIdMine=async(id:string)=>{
const res= await api.delete('items/'+id)
return res.data

}


export const createItem=async(newIten:newItem)=>{

    const res=await api.post('items',newIten)
    return res.data

}

export const updateItem = async (id: string, data: newItem) => {
    const res = await api.put('/items/' + id, data)
    return res.data
}
