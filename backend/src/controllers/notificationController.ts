import { Request, Response } from "express";
import { ErrorHandler } from "../middleware/errorHandler";
import { NotificationService } from "../services/notificationService";
import { ValidationUtils } from "../utils/errorUtils";
import { CreateNotificationData, UpdateNotificationData } from "../types/notification";

export class NotificationController {

    static createNotification = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
        const { Message, CreatedAt, ReadAt, IDUserFK } = req.body

        ValidationUtils.validateRequired(Message, 'Message', req);
        ValidationUtils.validateRequired(IDUserFK, 'IDUserFK', req);

        ValidationUtils.validateLength(Message, 'Message', 1, 500, req);
        await ValidationUtils.validateUserExists(IDUserFK, req);

        const notificationData: CreateNotificationData = { Message, IDUserFK };

        const notification = await NotificationService.createNotification(notificationData);

        res.status(201).json({
            success: true,
            data: notification,
            message: 'Notification created sucessfully'
        });
    });

    static getNotificationById = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
        
        const { id } = req.params;
        ValidationUtils.validateRequired(id, 'id', req);

        const notification = await NotificationService.getNotificationById(id);

        res.status(200).json({
            success: true,
            data: notification
        });
    });

    static getAllNotifications = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
        const notifications = await NotificationService.getAllNotifications();

        res.status(200).json({
            success: true,
            data: notifications,
            count: notifications.length
        });
    });

    static updateNotification = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { Message, CreatedAt, ReadAt, IDUserFK } = req.body;

        ValidationUtils.validateRequired(id, 'id', req);

        if (Message) {
            ValidationUtils.validateLength(Message, 'Message', 1, 500, req);
        }

        const notificationData: UpdateNotificationData = {
            Message,
            CreatedAt,
            ReadAt,
            IDUserFK
        };

        const notification = await NotificationService.updateNotification(id, notificationData);

        res.status(200).json({
            success: true,
            data: notification,
            message: 'Notification updated sucessfully'
        });
    });

    static deleteNotification = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        ValidationUtils.validateRequired(id, 'id', req);

        const result = await NotificationService.deleteNotification(id);

        res.status(200).json({
            success: true,
            data: result
        });
    }); 

    static markAsRead = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        ValidationUtils.validateRequired(id, 'id', req);

        const result = await NotificationService.markAsRead(id);

        res.status(200).json({
            success: true,
            data: result,
            message: result.Message
        });
    });

    static markAllAsRead = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {

        const { userId } = req.params;

        ValidationUtils.validateRequired(userId, 'userId', req);

        await ValidationUtils.validateUserExists(userId, req);

        const result = await NotificationService.markAllAsRead(userId);

        res.status(200).json({
            success: true,
            data: result,
            message: result.message
        });
    });

    static getUnreadNotifications = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;

        ValidationUtils.validateRequired(userId, 'userId', req);
        await ValidationUtils.validateUserExists(userId, req);

        const result = await NotificationService.getUnreadNotifications(userId);

        res.status(200).json({
            success: true,
            data: result,
            message: result.message
        });
    });

    
}