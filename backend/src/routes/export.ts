import { Router } from 'express';
import { exportReport } from '../controllers/exportController';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', auth, exportReport);

export default router;
