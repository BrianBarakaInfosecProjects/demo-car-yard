import { Router } from 'express';
import * as analyticsController from '../controllers/analyticsController';
import { auth, adminOnly } from '../middleware/auth';

const router = Router();

router.get('/dashboard', auth, adminOnly, analyticsController.getDashboardStats);
router.get('/popular-vehicles', auth, adminOnly, analyticsController.getPopularVehicles);
router.get('/inquiry-trends', auth, adminOnly, analyticsController.getInquiryTrends);
router.get('/vehicles-by-status', auth, adminOnly, analyticsController.getVehicleStatsByStatus);
router.get('/vehicles-by-body-type', auth, adminOnly, analyticsController.getVehicleStatsByBodyType);
router.get('/audit-logs', auth, adminOnly, analyticsController.getAuditLogs);

export default router;