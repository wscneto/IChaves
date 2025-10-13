import { Router } from 'express';
import { ClassroomController } from '../controllers/classroomController';

const router = Router();

// Classroom routes
router.post('/', ClassroomController.createClassroom);
router.get('/', ClassroomController.getAllClassrooms);
router.get('/:id', ClassroomController.getClassroomById);
router.put('/:id', ClassroomController.updateClassroom);
router.delete('/:id', ClassroomController.deleteClassroom);

export default router;
