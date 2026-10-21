import type { Meta } from "../types/meta"
import { api } from "./axios"


export const getAllMeta = async () => {
    const res = await api.get<Meta>('/meta')
    return res.data
}