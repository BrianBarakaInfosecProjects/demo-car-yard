import { Router } from 'express';
import * as sessionLogController from '../controllers/sessionLogController';
import { auth, adminOnly } from '../middleware/auth';

const router = Router();

router.get('/session', auth, adminOnly, sessionLogController.getSessionLogs);
router.get('/audit', auth, adminOnly, sessionLogController.getAuditLogs);
router.get('/all', auth, adminOnly, sessionLogController.getAllLogs);

export default router;
