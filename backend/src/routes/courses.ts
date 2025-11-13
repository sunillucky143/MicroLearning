import { Router } from 'express';
import {
  createCourse,
  getActiveCourse,
  getAllCourses,
  getCourseById,
} from '../controllers/courseController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', createCourse);
router.get('/active', getActiveCourse);
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

export default router;
