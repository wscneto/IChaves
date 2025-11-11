import { PrismaClient } from "@prisma/client";
import { AppError, ErrorCode } from "../types/errors";
import { CreateNotificationData, UpdateNotificationData } from "../types/notification";
import { getIO } from "./websocketService"; // Import getIO

const prisma = new PrismaClient;

export class NotificationService {
    
    static async createNotification(notificationData: CreateNotificationData) {
        try {

            const existingNotification = await prisma.notification.findFirst({
                where: {Message: notificationData.Message}
            });

            if (existingNotification) {
                throw new AppError(
                    ErrorCode.RESOURCE_CONFLICT,
                    'Notification with this name already exists',
                    409
                );
            }

            const notification = await prisma.notification.create({
                data: {
                    Message: notificationData.Message,
                    CreatedAt: new Date(),
                    ReadAt: notificationData.ReadAt,
                    IDUserFK: notificationData.IDUserFK,
                },
                select: {
                    IDNotification: true,
                    Message: true,
                    CreatedAt: true,
                    ReadAt: true,
                    IDUserFK: true,
                }
            });

            // Emit WebSocket event
            const io = getIO();
            io.to(`user:${notification.IDUserFK}`).emit('new_notification', notification);

            return notification;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError (
                ErrorCode.DATABASE_ERROR,
                'Failed to create notification',
                500
            );
        }
    }

    static async getNotificationById(id: string) {
        try {
            const notification = await prisma.notification.findUnique({
                where: {IDNotification: parseInt(id)},
                select: {
                    IDNotification: true, 
                    Message: true,
                    CreatedAt: true,
                    ReadAt: true,
                    IDUserFK: true
                }
            });

            if (!notification) {
                throw new AppError(
                    ErrorCode.RECORD_NOT_FOUND,
                    'Notification not found',
                    404
                );
            }

            return notification;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                ErrorCode.DATABASE_ERROR,
                'Failed to fetch notification',
                500
            );
        }
    }

    static async getAllNotifications() {
        try {
            const notifications = await prisma.notification.findMany({
                select: {
                    IDNotification: true, 
                    Message: true,
                    CreatedAt: true,
                    ReadAt: true,
                    IDUserFK: true
                },
                orderBy: {
                    IDNotification: 'desc'
                }
            });

            return notifications;
        } catch {
            throw new AppError(
                ErrorCode.DATABASE_ERROR,
                'Failed to fetch notifications',
                500
            );
        }
    }

    static async getNotificationsByUser(userId: number) {
        try {
            console.log(`[DEBUG] Fetching notifications for user ID: ${userId}`);
            
            const notifications = await prisma.notification.findMany({
                where: {
                    IDUserFK: userId
                },
                select: {
                    IDNotification: true, 
                    Message: true,
                    CreatedAt: true,
                    ReadAt: true,
                    IDUserFK: true
                },
                orderBy: {
                    IDNotification: 'desc'
                }
            });

            console.log(`[DEBUG] Found ${notifications.length} notifications for user ${userId}`);
            console.log(`[DEBUG] Notifications:`, notifications);

            return notifications;
        } catch (error) {
            console.error(`[DEBUG] Error fetching notifications for user ${userId}:`, error);
            throw new AppError(
                ErrorCode.DATABASE_ERROR,
                'Failed to fetch notifications by user',
                500
            );
        }
    }

    static async updateNotification(id: string, notificationData: UpdateNotificationData) {
        try {
            const existingNotification = await prisma.notification.findUnique({
                where: { IDNotification: parseInt(id) }
            });

            if (!existingNotification) {
                throw new AppError(
                    ErrorCode.RECORD_NOT_FOUND,
                    'Notification not found',
                    404
                );
            }

            if (notificationData.Message && notificationData.Message !== existingNotification.Message) {
                const messageConflict = await prisma.notification.findFirst({
                    where: {
                        Message: notificationData.Message,
                        IDNotification: { not: parseInt(id) }
                    }
                });

                if (messageConflict) {
                    throw new AppError(
                        ErrorCode.RESOURCE_CONFLICT,
                        'Notification with this message already exists',
                        409
                    );
                }
            }

            const notification = await prisma.notification.update({
                where: { IDNotification: parseInt(id) },
                data: notificationData,
                select: {
                    IDNotification: true, 
                    Message: true,
                    CreatedAt: true,
                    ReadAt: true,
                    IDUserFK: true
                }
            });

            // Emit WebSocket event for classroom update on notification approval
            const io = getIO();
            io.emit('notification_approved_classroom_update');

            return notification;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                ErrorCode.DATABASE_ERROR,
                'Failed to update notification',
                500
            );
        }
    }

    static async deleteNotification(id: string) {
        try {
            const existingNotification = await prisma.notification.findUnique({
                where: { IDNotification: parseInt(id) }
            });

            if (!existingNotification) {
                throw new AppError(
                    ErrorCode.RECORD_NOT_FOUND,
                    'Notification not found',
                    404
                );
            }

            //verifica se uma notificação está associada a usuarios

            const usersCount = await prisma.notification.count({
                where: { IDUserFK: parseInt(id) }
            });

            if (usersCount > 0) {
                throw new AppError(
                    ErrorCode.BUSINESS_RULE_VIOLATION,
                    'Cannot delete notification with associated users',
                    400
                );
            }

            await prisma.notification.delete({
                where: { IDNotification: parseInt(id) }
            });

            return { message: 'Notification deleted successfully' };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            throw new AppError(
                ErrorCode.DATABASE_ERROR,
                'Failed to delete notification',
                500
            );
        }
    }

    static async markAsRead(id: string) {
        try {
            const existingNotification = await prisma.notification.findUnique({
                where: { IDNotification: parseInt(id) }
            });

            if (!existingNotification) {
                throw new AppError(
                    ErrorCode.RECORD_NOT_FOUND,
                    'Notification not found',
                    404
                );
            }

            const updatedNotification = await prisma.notification.update({
                where: {IDNotification: parseInt(id)},
                data: { ReadAt: new Date() },
                select: {
                    IDNotification: true, 
                    Message: true,
                    CreatedAt: true,
                    ReadAt: true,
                    IDUserFK: true
                }
            });

            return updatedNotification;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                ErrorCode.DATABASE_ERROR,
                'Failed to update notification',
                500
            );
        }
    }

    static async markAllAsRead(userId: string){
        try {
            const notificationsUpdateds = await prisma.notification.updateMany({
                where: {
                    IDUserFK: parseInt(userId),
                    ReadAt: null
                },
                data: { ReadAt: new Date() }
            });

            if (!notificationsUpdateds) {
                throw new AppError(
                    ErrorCode.RECORD_NOT_FOUND,
                    'Notifications not found',
                    404
                );
            }

            
            return {
                success: true,
                data: {
                    updatedCount: notificationsUpdateds.count
                },
                message: `${notificationsUpdateds.count} notifications marked as read with successfully`
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                ErrorCode.DATABASE_ERROR,
                'Failed to update notifications',
                500
            );
        }
    }

    static async getUnreadNotifications(userId: string) {
        try {

            const user = await prisma.user.findUnique({
                where: { IDUser: parseInt(userId) },
                select: {
                IDUser: true,
                Name: true,
                Email: true,
                Student: {
                    select: {
                    Course: true,
                    Period: true,
                    }
                },
                Admin: true,
                }
            });

            if (!user) {
                throw new AppError(
                ErrorCode.RECORD_NOT_FOUND,
                'User not found',
                404
                );
            }

            const unreadNotifications = await prisma.notification.findMany({
                where: {
                    IDUserFK: parseInt(userId),
                    ReadAt: null
                },
                select: {
                    IDNotification: true, 
                    Message: true,
                    CreatedAt: true,
                    ReadAt: true,
                    IDUserFK: true
                },
                orderBy: {
                    CreatedAt: 'desc'
                }
            });

            if (!unreadNotifications) {
                throw new AppError(
                    ErrorCode.RECORD_NOT_FOUND,
                    'Notifications not found',
                    404
                );
            }
            
            const formattedNotifications = unreadNotifications.map(notification => ({
                IDNotification: notification.IDNotification,
                Message: notification.Message,
                CreatedAt: notification.CreatedAt.toISOString(),
                ReadAt: notification.ReadAt?.toISOString(),
                IDUserFK: notification.IDUserFK,
                User: user.Name
            }));

            return {
                success: true,
                data: formattedNotifications,
                message: `${formattedNotifications.length} notifications unreads was found`
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                ErrorCode.DATABASE_ERROR,
                'Failed fetch notifications',
                500
            );
        }
    }
}   