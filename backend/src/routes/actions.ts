import { Router } from 'express';
import { ActionController } from '../controllers/actionController';
<<<<<<< Updated upstream

=======
import { AuthMiddleware } from '../middleware/auth'
>>>>>>> Stashed changes
/**
 * Actions router
 * Handles all action-related endpoints for classroom key management
 * 
<<<<<<< Updated upstream
 * Available actions:
 * - reservar: Student reserves key from administration
 * - trocar: Student exchanges key with another student
 * - devolver: Student returns key to administration
 * - solicitar: Admin requests key for student
 * - suspender: Admin suspends key
 * - liberar: Admin releases key
 */
=======
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
>>>>>>> Stashed changes

const router = Router();

// Action endpoints
<<<<<<< Updated upstream
router.post('/reservar', ActionController.reservar);
router.post('/trocar', ActionController.trocar);
router.post('/devolver', ActionController.devolver);
router.post('/solicitar', ActionController.solicitar);
router.post('/suspender', ActionController.suspender);
router.post('/liberar', ActionController.liberar);
=======
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
>>>>>>> Stashed changes

// Utility endpoints
router.get('/permissions', ActionController.getPermissions);
router.get('/classroom/:id/state', ActionController.getClassroomStateValidation);
router.get('/user/:id/permissions', ActionController.getUserPermissions);
<<<<<<< Updated upstream

export default router;



=======
router.get('/debug/users', ActionController.debugUsers);

export default router;

>>>>>>> Stashed changes
