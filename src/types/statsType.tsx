
import type { Item } from './itemType'; 
   
export type MyStats = {
  totals: {
    myItemsCount: number;
    timesMyItemsLent: number;
    timesIBorrowed: number;
    pendingReceived: number;
  };
  monthly: {
    month: string;
    lent: number;
    borrowed: number;
  }[];
  topItem: {
    id: string;
    title: string;
    count: number;
  } | null;
};



 

export type NeighborhoodStats = {
  daily: {
    date: string;
    newItems: number;
    newRequests: number;
  }[];
  mostRequested: {
    item: Item;
    count: number;
  }[];
  newItemsThisWeek: number;
};


export type AdminStats = {
  totals: {
    users: number;
    items: number;
    activeLoans: number;
    pendingRequests: number;
  };
  byCategory: {
    category: string;
    items: number;
    requests: number;
  }[];
  byStatus: {
    status: string;
    count: number;
  }[];
  monthlyRequests: {
    month: string;
    count: number;
  }[];
};