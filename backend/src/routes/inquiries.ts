import { Router } from 'express';
import * as inquiryController from '../controllers/inquiryController';
import { auth, adminOnly } from '../middleware/auth';

const router = Router();

router.post('/', inquiryController.createInquiry);
router.get('/', auth, adminOnly, inquiryController.getInquiries);
router.patch('/:id/status', auth, adminOnly, inquiryController.updateInquiryStatus);
router.delete('/:id', auth, adminOnly, inquiryController.deleteInquiry);

export default router;
