import { Router } from 'express';
import {
  submitLead,
  getAdminLeads,
  getLeadById,
  updateLeadStatus,
  addLeadNote,
  deleteLead,
  exportLeadsCSV,
} from '../controllers/leadController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

// Public route for lead submission
router.post('/', submitLead);

// Admin protected routes
router.use(protect);
router.get('/admin', getAdminLeads);
router.get('/admin/export', exportLeadsCSV);
router.get('/admin/:id', getLeadById);
router.patch('/admin/:id/status', updateLeadStatus);
router.post('/admin/:id/notes', addLeadNote);
router.delete('/admin/:id', restrictTo('SUPER_ADMIN', 'ADMIN'), deleteLead);

export default router;
