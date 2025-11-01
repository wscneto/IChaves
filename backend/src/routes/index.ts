import { Router } from 'express';
import examplesRouter from './examples';
import usersRouter from './users';
import classroomsRouter from './classrooms';
import historiesRouter from './histories';


/**
 * Main router that aggregates all route modules
 * This file serves as the central point for all API routes
 */

const router = Router();

// API Routes
router.use('/examples', examplesRouter);
router.use('/users', usersRouter);
router.use('/classrooms', classroomsRouter);
router.use('/histories', historiesRouter);

// Add more route modules here as they are created
// router.use('/notifications', notificationsRouter);

export default router;