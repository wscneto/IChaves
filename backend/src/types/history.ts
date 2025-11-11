import { History, User, Classroom } from '@prisma/client';

export interface HistoryWithRelations extends History {
  User: User;
  Classroom: Classroom;
}

export type CreateHistoryData = Omit<History, 'IDHistory' | 'StartDate' | 'ReturnDate'> & {
  ReturnDate?: Date | null;
};

export type UpdateHistoryData = Partial<CreateHistoryData>;

export interface HistoryQueryParams {
  page?: number;
  limit?: number;
  user_id?: number;
  classroom_id?: number;
  start_date_from?: string;
  start_date_to?: string;
  return_date_from?: string;
  return_date_to?: string;
  is_active?: boolean;
  sort_by?: 'StartDate' | 'ReturnDate';
  sort_order?: 'asc' | 'desc';
}