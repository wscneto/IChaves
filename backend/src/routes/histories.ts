import { Router } from 'express';
import { HistoryController } from '../controllers/historyController';
// import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.post('/', /*authMiddleware,*/ HistoryController.createHistory);
router.get('/', /*authMiddleware,*/ HistoryController.getAllHistories);
router.get('/:id', /*authMiddleware,*/ HistoryController.getHistoryById);
router.put('/:id', /*authMiddleware,*/ HistoryController.updateHistory);

export default router;