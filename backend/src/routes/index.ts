import { Router } from 'express';
import usersRouter from './users';
import classroomsRouter from './classrooms';
import actionsRouter from './actions';
import notificationsRouter from './notifications';
import AuthRouter from './auth'
import historiesRouter from './histories'

/**
 * Main router that aggregates all route modules
 * This file serves as the central point for all API routes
 */

const router = Router();

// API Routes - Add your route modules here
router.use('/users', usersRouter);
// Classroom routes
router.use('/classrooms', classroomsRouter);
// Action routes
router.use('/actions', actionsRouter);
// Auth routes
router.use('/auth', AuthRouter);
//Notification routes
router.use('/notifications', notificationsRouter);

router.use('/histories', historiesRouter)

export default router;