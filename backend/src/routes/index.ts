import { Router } from 'express';
import examplesRouter from './examples';
import usersRouter from './users';
import classroomsRouter from './classrooms';
import notificationsRouter from './notifications'

/**
 * Main router that aggregates all route modules
 * This file serves as the central point for all API routes
 */

const router = Router();

// API Routes - Add your route modules here
// Errors
router.use('/examples', examplesRouter);
// Example routes
router.use('/users', usersRouter);
// Classroom routes
router.use('/classrooms', classroomsRouter);
//Notification routes
router.use('/notifications', notificationsRouter);


// Add more route modules here as they are created



export default router;