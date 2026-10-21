import type { AdminUser } from "../types/user";
import { api } from "./axios";

export const getAdminUsers = async () => {
  const res = await api.get<AdminUser[]>('/admin/users');
  return res.data;
};