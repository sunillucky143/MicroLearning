import { Router } from 'express';
import {
  getTopicsByDate,
  getTopicById,
  markTopicComplete,
  getTopicsByCourse,
} from '../controllers/topicController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/date/:date', getTopicsByDate);
router.get('/course/:courseId', getTopicsByCourse);
router.get('/:id', getTopicById);
router.patch('/:id/complete', markTopicComplete);

export default router;
