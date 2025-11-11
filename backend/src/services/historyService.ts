
import { PrismaClient, Prisma } from '@prisma/client';
import { AppError, ErrorCode } from '../types/errors';
import { CreateHistoryData, UpdateHistoryData, HistoryQueryParams } from '../types/history';

const prisma = new PrismaClient();

export class HistoryService {
  static async createHistory(historyData: CreateHistoryData) {
    try {
      const newHistory = await prisma.history.create({
        data: {
          ...historyData,
          StartDate: historyData.StartDate || new Date(),
        },
        include: {
          User: true,
          Classroom: true,
        },
      });
      return newHistory;
    } catch (Error) {
      throw new AppError(ErrorCode.DATABASE_ERROR, 'Failed to create history', 500);
    }
  }

  static async getHistoryById(id: string) {
    try {
      const history = await prisma.history.findUnique({
        where: { IDHistory: parseInt(id) },
        include: {
          User: true,
          Classroom: true,
        },
      });

      if (!history) {
        throw new AppError(ErrorCode.RECORD_NOT_FOUND, 'History not found', 404);
      }

      return history;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(ErrorCode.DATABASE_ERROR, 'Failed to fetch history', 500);
    }
  }

  static async getAllHistories(filters: HistoryQueryParams) {
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
    } = filters;

    const where: Prisma.HistoryWhereInput = {};

    if (user_id) where.IDUserFK = user_id;
    if (classroom_id) where.IDClassroomFK = classroom_id;
    if (start_date_from) where.StartDate = {gte: new Date(start_date_from) };
    if (start_date_to) where.StartDate = {lte: new Date(start_date_to) };
    if (return_date_from) where.ReturnDate = {gte: new Date(return_date_from) };
    if (return_date_to) where.ReturnDate = {lte: new Date(return_date_to) };
    if (is_active !== undefined) where.ReturnDate = is_active ? null : { not: null };
    
    try {
      const histories = await prisma.history.findMany({
        where,
        include: {
          User: true,
          Classroom: true,
        },
        orderBy: {
          [sort_by]: sort_order,
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      const total = await prisma.history.count({ where });

      return {
        data: histories,
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new AppError(ErrorCode.DATABASE_ERROR, 'Failed to fetch histories', 500);
    }
  }

  static async updateHistory(id: string, historyData: UpdateHistoryData) {
    try {
      const updatedHistory = await prisma.history.update({
        where: { IDHistory: parseInt(id) },
        data: historyData,
        include: {
          User: true,
          Classroom: true,
        },
      });
      return updatedHistory;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(ErrorCode.DATABASE_ERROR, 'Failed to update history', 500);
    }
  }
}
