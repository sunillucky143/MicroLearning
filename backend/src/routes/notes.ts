import { Router } from 'express';
import {
  getNoteByTopic,
  createNote,
  updateNote,
} from '../controllers/noteController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/topic/:topicId', getNoteByTopic);
router.post('/', createNote);
router.patch('/:id', updateNote);

export default router;
