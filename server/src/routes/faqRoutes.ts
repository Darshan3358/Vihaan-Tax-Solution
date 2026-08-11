import { Router } from 'express';
import {
  getFAQs,
  getAdminFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} from '../controllers/faqController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getFAQs);

router.use(protect);
router.get('/admin/all', getAdminFAQs);
router.post('/admin', restrictTo('SUPER_ADMIN', 'ADMIN'), createFAQ);
router.patch('/admin/:id', restrictTo('SUPER_ADMIN', 'ADMIN', 'EDITOR'), updateFAQ);
router.delete('/admin/:id', restrictTo('SUPER_ADMIN', 'ADMIN'), deleteFAQ);

export default router;
