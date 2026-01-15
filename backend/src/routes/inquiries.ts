import { Router } from 'express';
import * as inquiryController from '../controllers/inquiryController';
import { auth, adminOnly } from '../middleware/auth';
import { auditLogger } from '../middleware/audit';

const router = Router();

router.post('/', inquiryController.createInquiry);
router.get('/', auth, adminOnly, inquiryController.getInquiries);
router.patch('/:id/status', auth, adminOnly, auditLogger('UPDATE_STATUS', 'INQUIRY'), inquiryController.updateInquiryStatus);
router.delete('/:id', auth, adminOnly, auditLogger('DELETE', 'INQUIRY'), inquiryController.deleteInquiry);

export default router;
