import { Router } from 'express';
import * as authController from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', auth, authController.logout);
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, authController.updateProfile);

export default router;
