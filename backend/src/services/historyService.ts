
import { PrismaClient, Prisma } from '@prisma/client';
import { AppError, ErrorCode } from '../types/errors';
import { CreateHistoryData, UpdateHistoryData, HistoryQueryParams } from '../types/history';

const prisma = new PrismaClient();

export class HistoryService {
  static async createHistory(historyData: CreateHistoryData) {
    const { IDUserFK, IDClassroomFK } = historyData;

    const user = await prisma.user.findUnique({ where: { IDUser: IDUserFK } });
    if (!user) {
      throw new AppError(ErrorCode.RECORD_NOT_FOUND, 'User not found', 404);
    }

    const classroom = await prisma.classroom.findUnique({ where: { IDClassroom: IDClassroomFK } });
    if (!classroom) {
      throw new AppError(ErrorCode.RECORD_NOT_FOUND, 'Classroom not found', 404);
    }

    try {
      const newHistory = await prisma.history.create({
        data: {
          ...historyData,
          StartDate: new Date(),
        },
        include: {
          User: true,
          Classroom: true,
        },
      });
      return newHistory;
    } catch (error) {
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
    if (start_date_from) where.StartDate = { ...where.StartDate, gte: new Date(start_date_from) };
    if (start_date_to) where.StartDate = { ...where.StartDate, lte: new Date(start_date_to) };
    if (return_date_from) where.ReturnDate = { ...where.ReturnDate, gte: new Date(return_date_from) };
    if (return_date_to) where.ReturnDate = { ...where.ReturnDate, lte: new Date(return_date_to) };
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
    const { IDUserFK, IDClassroomFK, StartDate, ReturnDate } = historyData;

    if (IDUserFK) {
        const user = await prisma.user.findUnique({ where: { IDUser: IDUserFK } });
        if (!user) {
            throw new AppError(ErrorCode.RECORD_NOT_FOUND, 'User not found', 404);
        }
    }
    
    if (IDClassroomFK) {
        const classroom = await prisma.classroom.findUnique({ where: { IDClassroom: IDClassroomFK } });
        if (!classroom) {
            throw new AppError(ErrorCode.RECORD_NOT_FOUND, 'Classroom not found', 404);
        }
    }

    if (StartDate && ReturnDate && new Date(ReturnDate) < new Date(StartDate)) {
        throw new AppError(ErrorCode.VALIDATION_ERROR, 'ReturnDate cannot be earlier than StartDate', 400);
    }

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
