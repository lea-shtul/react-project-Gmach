

export type RequestStatus =
  'PENDING' | 'APPROVED' | 'REJECTED' | 'BORROWED' | 'RETURNED' | 'CANCELLED';

export type RequestPerson = {
  id: string;
  fullName: string;
  neighborhood: string;
  phone?: string | null;
};

export type LoanRequest = {
  id: string;
  status: RequestStatus;
  startDate: string;
  endDate: string;
  message: string | null;
  borrowedAt: string | null;
  returnedAt: string | null;
  createdAt: string;
  updatedAt: string;
  item: {
    id: string;
    title: string;
    category: string;
    neighborhood: string;
  };
  borrower: RequestPerson;
  owner: RequestPerson;
};