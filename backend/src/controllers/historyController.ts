import { Request, Response } from 'express';
import { ErrorHandler } from '../middleware/errorHandler';
import { HistoryService } from '../services/historyService';
import { RequestWithUser, ValidationUtils } from '../utils/errorUtils';
import { CreateHistoryData, UpdateHistoryData, HistoryQueryParams } from '../types/history';

export class HistoryController {
  static createHistory = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const { IDClassroomFK } = req.body;
    const IDUserFK = parseInt((req as RequestWithUser).user!.id);

    ValidationUtils.validateRequired(IDUserFK, 'IDUserFK', req);
    ValidationUtils.validateRequired(IDClassroomFK, 'IDClassroomFK', req);
    await ValidationUtils.validateUserExists(IDUserFK.toString());
    await ValidationUtils.validateClassroomExists(IDClassroomFK, req);

    const historyData: CreateHistoryData = { IDUserFK, IDClassroomFK };
    const history = await HistoryService.createHistory(historyData);

    res.status(201).json({
      success: true,
      data: history,
      message: 'History created successfully',
    });
  });

  static getAllHistories = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const { user_id, classroom_id, start_date_from, start_date_to, return_date_from, return_date_to, is_active, sort_by, sort_order, page, limit } = req.query;

    const filters: HistoryQueryParams = {
      user_id: user_id ? parseInt(user_id as string) : undefined,
      classroom_id: classroom_id ? parseInt(classroom_id as string) : undefined,
      start_date_from: start_date_from as string,
      start_date_to: start_date_to as string,
      return_date_from: return_date_from as string,
      return_date_to: return_date_to as string,
      is_active: is_active !== undefined ? String(is_active).toLowerCase() === 'true' : undefined,
      sort_by: sort_by as string,
      sort_order: sort_order as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    };
    const histories = await HistoryService.getAllHistories(filters);

    res.status(200).json({
      success: true,
      ...histories,
    });
  });

  static getHistoryById = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    ValidationUtils.validateRequired(id, 'id', req);

    const history = await HistoryService.getHistoryById(id);

    res.status(200).json({
      success: true,
      data: history,
    });
  });

  static updateHistory = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    ValidationUtils.validateRequired(id, 'id', req);

    const { IDUserFK, IDClassroomFK, StartDate, ReturnDate } = req.body;

    if (IDUserFK) await ValidationUtils.validateUserExists(IDUserFK);
    if (IDClassroomFK) await ValidationUtils.validateClassroomExists(IDClassroomFK, req);
    if (StartDate) ValidationUtils.validateDate(StartDate, 'StartDate', req);
    if (ReturnDate) ValidationUtils.validateDate(ReturnDate, 'ReturnDate', req);
    if (StartDate && ReturnDate) ValidationUtils.validateDateRange(StartDate, ReturnDate, req);

    const historyData: UpdateHistoryData = req.body;
    const history = await HistoryService.updateHistory(id, historyData);

    res.status(200).json({
      success: true,
      data: history,
      message: 'History updated successfully',
    });
  });
}