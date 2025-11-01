import { PrismaClient } from '@prisma/client';
import {
  CreateHistoryData,
  UpdateHistoryData,
  HistoryWithRelations,
  HistoryQueryParams,
  PaginatedResult,
} from '../types/history';

const prisma = new PrismaClient();

const historySelect = {
  IDHistory: true,
  StartDate: true,
  ReturnDate: true,
  IDUserFK: true,
  IDClassroomFK: true,
  User: {
    select: {
      IDUser: true,
      Name: true,
    },
  },
  Classroom: {
    select: {
      IDClassroom: true,
      Name: true,
    },
  },
};

export class HistoryService {
  static async createHistory(input: CreateHistoryData): Promise<HistoryWithRelations> {
    return await prisma.history.create({
      data: {
        ...input,
        StartDate: input.StartDate ? new Date(input.StartDate) : new Date(),
        ReturnDate: input.ReturnDate ? new Date(input.ReturnDate) : null,
      },
      select: historySelect,
    });
  }

  static async getHistoryById(id: string): Promise<HistoryWithRelations | null> {
    return await prisma.history.findUnique({
      where: { IDHistory: parseInt(id) },
      select: historySelect,
    });
  }

  static async getAllHistories(
    queryParams: HistoryQueryParams,
  ): Promise<PaginatedResult<HistoryWithRelations>> {
    const {
      page = 1,
      limit = 10,
      user_id,
      classroom_id,
      start_date_from,
      start_date_to,
      return_date_from,
      return_date_to,
      is_active,
      sort_by = 'StartDate',
      sort_order = 'desc',
    } = queryParams;

    const where: any = {};

    if (user_id) where.IDUserFK = user_id;
    if (classroom_id) where.IDClassroomFK = classroom_id;
    if (is_active !== undefined) {
      if (is_active) {
        where.ReturnDate = null;
      } else {
        where.ReturnDate = { not: null };
      }
    }

    if (start_date_from) where.StartDate = { ...where.StartDate, gte: new Date(start_date_from) };
    if (start_date_to) where.StartDate = { ...where.StartDate, lte: new Date(start_date_to) };
    if (return_date_from) where.ReturnDate = { ...where.ReturnDate, gte: new Date(return_date_from) };
    if (return_date_to) where.ReturnDate = { ...where.ReturnDate, lte: new Date(return_date_to) };

    const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
    const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit;

    const total = await prisma.history.count({ where });
    const data = await prisma.history.findMany({
      where,
      select: historySelect,
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      orderBy: {
        [sort_by]: sort_order,
      },
    });

    return { data, total, page: pageNum, limit: limitNum };
  }

  static async updateHistory(
    id: string,
    input: UpdateHistoryData,
  ): Promise<HistoryWithRelations> {
    return await prisma.history.update({
      where: { IDHistory: parseInt(id) },
      data: {
        ...input,
        StartDate: input.StartDate ? new Date(input.StartDate) : undefined,
        ReturnDate: input.ReturnDate ? new Date(input.ReturnDate) : null,
      },
      select: historySelect,
    });
  }
}