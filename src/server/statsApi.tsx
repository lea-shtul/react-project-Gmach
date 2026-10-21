import type { AdminStats, MyStats, NeighborhoodStats } from "../types/statsType";
import { api } from "./axios";

export const getMyStats = async () => {
  const res = await api.get<MyStats>('stats/me');
  return res.data;
};

export const getNeighborhoodStats = async () => {
  const res = await api.get<NeighborhoodStats>('stats/neighborhood');
  return res.data;
};

export const getAdminStats = async () => {
  const res = await api.get<AdminStats>('admin/stats');
  return res.data;
};