import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

// 1. Criamos a "recepcionista" para este arquivo
const router = Router();

// 2. Conectamos o endpoint de LOGIN
router.post('/login', AuthController.login);

// 3. Conectamos o endpoint ME
router.get('/me', authenticateToken, AuthController.me);

export default router;