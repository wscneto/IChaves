import { Router } from 'express';
import examplesRouter from './examples';
import usersRouter from './users';

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

// Add more route modules here as they are created
// router.use('/classrooms', classroomsRouter);
// router.use('/notifications', notificationsRouter);

export default router;