import { Router } from 'express';
import {
  chat,
  generateGame,
  generateAudio,
  generatePodcast,
  generateVideo,
  generateComic,
  customFeature,
} from '../controllers/learningController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/chat/:topicId', chat);
router.post('/game/:topicId', generateGame);
router.post('/audio/:topicId', generateAudio);
router.post('/podcast/:topicId', generatePodcast);
router.post('/video/:topicId', generateVideo);
router.post('/comic/:topicId', generateComic);
router.post('/custom/:topicId', customFeature);

export default router;
