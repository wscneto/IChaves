import { Request, Response } from 'express';
import { ErrorHandler } from '../middleware/errorHandler';
import { HistoryService } from '../services/historyService';
import { HistoryQueryParams } from '../types/history';
import { ErrorUtils } from '../utils/errorUtils';

export class HistoryController {
  static createHistory = ErrorHandler.asyncHandler(
    async (req: Request, res: Response) => {
      const history = await HistoryService.createHistory(req.body);
      res.status(201).json(history);
    },
  );

  static getAllHistories = ErrorHandler.asyncHandler(
    async (req: Request, res: Response) => {
      const histories = await HistoryService.getAllHistories(
        req.query as unknown as HistoryQueryParams,
      );
      res.status(200).json(histories);
    },
  );

  static getHistoryById = ErrorHandler.asyncHandler(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const history = await HistoryService.getHistoryById(id);
      if (!history) {
        ErrorUtils.throwNotFoundError('History not found', req);
      }
      res.status(200).json(history);
    },
  );

  static updateHistory = ErrorHandler.asyncHandler(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const updatedHistory = await HistoryService.updateHistory(id, req.body);
      res.status(200).json(updatedHistory);
    },
  );
}
