import { Router } from 'express';
import {
  getServices,
  getServiceBySlug,
  getAllAdminServices,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', getServices);
router.get('/:slug', getServiceBySlug);

// Admin protected routes
router.use(protect);
router.get('/admin/all', getAllAdminServices);
router.post('/admin', restrictTo('SUPER_ADMIN', 'ADMIN'), createService);
router.patch('/admin/:id', restrictTo('SUPER_ADMIN', 'ADMIN', 'EDITOR'), updateService);
router.delete('/admin/:id', restrictTo('SUPER_ADMIN', 'ADMIN'), deleteService);

export default router;
