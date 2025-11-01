import { Request, Response } from 'express';
import { ErrorHandler } from '../middleware/errorHandler';
import { HistoryService } from '../services/historyService';
import { ValidationUtils } from '../utils/errorUtils';
import { CreateHistoryData, UpdateHistoryData, HistoryQueryParams } from '../types/history';

export class HistoryController {
  static createHistory = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const { IDUserFK, IDClassroomFK } = req.body;

    ValidationUtils.validateRequired(IDUserFK, 'IDUserFK', req);
    ValidationUtils.validateRequired(IDClassroomFK, 'IDClassroomFK', req);

    const historyData: CreateHistoryData = { IDUserFK, IDClassroomFK };
    const history = await HistoryService.createHistory(historyData);

    res.status(201).json({
      success: true,
      data: history,
      message: 'History created successfully',
    });
  });

  static getAllHistories = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const filters: HistoryQueryParams = req.query;
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

    const historyData: UpdateHistoryData = req.body;
    const history = await HistoryService.updateHistory(id, historyData);

    res.status(200).json({
      success: true,
      data: history,
      message: 'History updated successfully',
    });
  });
}