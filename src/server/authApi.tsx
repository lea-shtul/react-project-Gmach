
import type { loginRequest, registerRequest, User } from '../types/user'
import { api } from './axios';



export const loginApi = async (request: loginRequest) => {
    const res = await api.post('/auth/login', request);
    return res.data;
};


export const register = async (request: registerRequest) => {

    const res = await api.post('/auth/register', request)
    return res.data
}

export const getMe=async()=>{
    const res=await api.get<User>('/auth/me')
    return res.data
}