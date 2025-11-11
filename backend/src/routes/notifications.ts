import { Router } from "express";
import { NotificationController } from "../controllers/notificationController";

const router = Router();

router.post('/', NotificationController.createNotification);
router.get('/', NotificationController.getAllNotifications);
router.get('/:id', NotificationController.getNotificationById);
router.put('/:id', NotificationController.updateNotification);
router.delete('/:id', NotificationController.deleteNotification);

router.patch('/:id/read', NotificationController.markAsRead);
router.patch('/user/:userId/read-all', NotificationController.markAllAsRead);
router.get('/user/:userId/unread', NotificationController.getUnreadNotifications);

//implementar get all unread notifications
//implementar get all notifications de um user

export default router;