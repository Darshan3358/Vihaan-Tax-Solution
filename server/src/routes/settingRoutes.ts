import { Router } from 'express';
import { getPublicSettings, updateAdminSettings } from '../controllers/settingController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

router.get('/public', getPublicSettings);

router.use(protect);
router.patch('/admin', restrictTo('SUPER_ADMIN', 'ADMIN', 'EDITOR'), updateAdminSettings);

export default router;
