
import { Router } from 'express';
import { HistoryController } from '../controllers/historyController';
import { AuthMiddleware } from '../middleware/auth'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET não definido, não é possível iniciar o auth middleware.')
}

const authMiddleware = new AuthMiddleware(JWT_SECRET)

const router = Router();

router.post('/', authMiddleware.authenticate, HistoryController.createHistory)
router.get('/', authMiddleware.authenticate, HistoryController.getAllHistories)
router.get('/:id', authMiddleware.authenticate, HistoryController.getHistoryById)
router.put('/:id', authMiddleware.authenticate, HistoryController.updateHistory)

export default router;
