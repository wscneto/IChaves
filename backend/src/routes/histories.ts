
import { Router } from 'express';
import { HistoryController } from '../controllers/historyController';

const router = Router();

router.post('/', HistoryController.createHistory);
router.get('/', HistoryController.getAllHistories);
router.get('/:id', HistoryController.getHistoryById);
router.put('/:id', HistoryController.updateHistory);

export default router;
