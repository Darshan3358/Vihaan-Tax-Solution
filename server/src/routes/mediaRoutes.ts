import { Router } from 'express';
import { uploadMedia, getMediaList, deleteMedia } from '../controllers/mediaController';
import { protect, restrictTo } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

router.use(protect);
router.post('/admin', upload.single('image'), uploadMedia);
router.get('/admin', getMediaList);
router.delete('/admin/:id', restrictTo('SUPER_ADMIN', 'ADMIN'), deleteMedia);

export default router;
