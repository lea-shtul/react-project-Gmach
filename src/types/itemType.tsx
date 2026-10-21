

export type Item = {
    id: string;
    ownerId: string;
    title: string;
    description: string | null;
    category: string;
    condition: string;
    neighborhood: string;
    isPublic: boolean;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
    owner: {
        id: string;
        fullName: string;
        neighborhood: string;
    };
};

export type ItemsResponse = {
  items: Item[];
  total: number;
  page: number;
  pageSize: number;
};


export type requestItem = {
    startDate: string,
    endDate: string,
    message?: string,
    itemId:string
}

export type newItem={
title:string,
description?:string,
condition:string,
category:string,
neighborhood:string,
isPublic?:boolean,
}


export type ItemFilters = {
  page: number;
  search: string;
  category: string;
  sort: string;
};