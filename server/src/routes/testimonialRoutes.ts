import { Router } from 'express';
import {
  getTestimonials,
  getAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getTestimonials);

router.use(protect);
router.get('/admin/all', getAdminTestimonials);
router.post('/admin', restrictTo('SUPER_ADMIN', 'ADMIN'), createTestimonial);
router.patch('/admin/:id', restrictTo('SUPER_ADMIN', 'ADMIN', 'EDITOR'), updateTestimonial);
router.delete('/admin/:id', restrictTo('SUPER_ADMIN', 'ADMIN'), deleteTestimonial);

export default router;
