import { Request } from 'express';
import { History as PrismaHistory, User, Classroom } from '@prisma/client';

export interface History extends PrismaHistory {}

export interface CreateHistoryData {
  IDUserFK: number;
  IDClassroomFK: number;
  StartDate?: string;
  ReturnDate?: string | null;
}

export interface UpdateHistoryData {
  StartDate?: string;
  ReturnDate?: string | null;
}

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

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

export interface HistoryWithRelations extends History {
  User: { id: number; name: string } | null;
  Classroom: { id: number; name: string } | null;
}

export type CreateHistoryRequest = Request<{}, any, CreateHistoryData, {}>;
export type UpdateHistoryRequest = Request<{ id: string }, any, UpdateHistoryData, {}>;
export type GetHistoryByIdRequest = Request<{ id: string }>;
export type ListHistoriesRequest = Request<{}, any, {}, HistoryQueryParams>;

