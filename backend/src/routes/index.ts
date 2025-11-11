import { Router } from 'express';
import examplesRouter from './examples';
import usersRouter from './users';
import classroomsRouter from './classrooms';
import notificationsRouter from './notifications'
import historiesRouter from './histories';

import actionsRouter from './actions';

/**
 * Main router that aggregates all route modules
 * This file serves as the central point for all API routes
 */

const router = Router();

// API Routes
router.use('/examples', examplesRouter);
router.use('/users', usersRouter);
router.use('/classrooms', classroomsRouter);
//Notification routes
router.use('/notifications', notificationsRouter);

router.use('/histories', historiesRouter);
// Action routes
router.use('/actions', actionsRouter);

// Add more route modules here as they are created



export default router;