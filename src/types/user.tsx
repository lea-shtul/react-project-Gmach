export type loginRequest = {
    email: string;
    password: string
}

export type registerRequest = {
    fullName: string
    email: string
    password: string
    phone: string
    neighborhood: string
}


export type User = {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    neighborhood: string;
    role: 'USER' | 'ADMIN';
    createdAt: string;
};



export type AdminUser = User &{
  itemsCount: number;
  requestsCount: number;
}