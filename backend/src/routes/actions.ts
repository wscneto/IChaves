import { Router } from 'express';
import { ActionController } from '../controllers/actionController';
import { AuthMiddleware } from '../middleware/auth'
/**
 * Actions router
 * Handles all action-related endpoints for classroom key management
 * 
 * Student actions:
 * - reservar: Student reserves key from administration (Disponivel -> Em uso)
 * - trocar: Student exchanges key with another student (Em uso -> Em uso)
 * - devolver: Student returns key to administration (Em uso -> Disponivel)
 * - suspenso: Student cannot perform any actions (not implemented in backend)
 * 
 * Admin actions:
 * - solicitar: Admin requests key from user (obrigatório) (Em uso -> Disponivel)
 * - suspender: Admin suspends classroom (only if available) (Disponivel -> Indisponivel)
 * - liberar: Admin releases suspended classroom (Indisponivel -> Disponivel)
 */
const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET não definido, não é possível iniciar o auth middleware.')
}

const authMiddleware = new AuthMiddleware(JWT_SECRET)

const router = Router();

// Action endpoints
router.post('/reservar', authMiddleware.authenticate, authMiddleware.requireStudent, ActionController.reservar)
router.post('/trocar', authMiddleware.authenticate, authMiddleware.requireStudent, ActionController.trocar)
router.post('/devolver', authMiddleware.authenticate, authMiddleware.requireStudent, ActionController.devolver)
router.post('/solicitar', authMiddleware.authenticate, authMiddleware.requireAdmin, ActionController.solicitar)
router.post('/suspender', authMiddleware.authenticate, authMiddleware.requireAdmin, ActionController.suspender)
router.post('/liberar', authMiddleware.authenticate, authMiddleware.requireAdmin, ActionController.liberar)
router.post(
    '/process-reservation',
    authMiddleware.authenticate,
    authMiddleware.requireAdmin, 
    ActionController.processReservation,
)
router.post(
    '/process-devolution',
    authMiddleware.authenticate,
    authMiddleware.requireAdmin,
    ActionController.processDevolution,
)
router.post(
    '/process-key-request',
    authMiddleware.authenticate,
    authMiddleware.requireStudent,
    ActionController.processKeyRequest,
)
router.post('/process-trade', authMiddleware.authenticate, authMiddleware.requireStudent, ActionController.processTrade)

// Utility endpoints
router.get('/permissions', ActionController.getPermissions);
router.get('/classroom/:id/state', ActionController.getClassroomStateValidation);
router.get('/user/:id/permissions', ActionController.getUserPermissions);
router.get('/debug/users', ActionController.debugUsers);

export default router;

