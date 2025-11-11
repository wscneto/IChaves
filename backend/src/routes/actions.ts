import { Router } from 'express';
import { ActionController } from '../controllers/actionController';

/**
 * Actions router
 * Handles all action-related endpoints for classroom key management
 * 
 * Available actions:
 * - reservar: Student reserves key from administration
 * - trocar: Student exchanges key with another student
 * - devolver: Student returns key to administration
 * - solicitar: Admin requests key for student
 * - suspender: Admin suspends key
 * - liberar: Admin releases key
 */

const router = Router();

// Action endpoints
router.post('/reservar', ActionController.reservar);
router.post('/trocar', ActionController.trocar);
router.post('/devolver', ActionController.devolver);
router.post('/solicitar', ActionController.solicitar);
router.post('/suspender', ActionController.suspender);
router.post('/liberar', ActionController.liberar);

// Utility endpoints
router.get('/permissions', ActionController.getPermissions);
router.get('/classroom/:id/state', ActionController.getClassroomStateValidation);
router.get('/user/:id/permissions', ActionController.getUserPermissions);

export default router;



