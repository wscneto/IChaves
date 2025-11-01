import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { AuthMiddleware } from '../middleware/auth'; //

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET não definido, não é possível iniciar o auth middleware.');
}

const authMiddleware = new AuthMiddleware(JWT_SECRET);

router.post('/login', AuthController.login);

router.get('/me', authMiddleware.authenticate, AuthController.me);
router.post('/logout', authMiddleware.authenticate, AuthController.logout);

export default router;