import { Router } from 'express';
import * as userController from '../controllers/userController';
import { auth, adminOnly } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(auth);

// Public routes - any authenticated user can view users
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/:id/reset-password', userController.resetPassword);

// Admin-only routes - require ADMIN or STAFF role
router.post('/', adminOnly, userController.createUser);
router.put('/:id', adminOnly, userController.updateUser);
router.delete('/:id', adminOnly, userController.deleteUser);
router.put('/:id/role', adminOnly, userController.updateUserRole);

export default router;
