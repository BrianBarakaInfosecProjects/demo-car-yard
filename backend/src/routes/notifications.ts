import { Router, Request, Response } from 'express';
import { notificationService } from '../services/notificationService';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');
    const userId = 'admin-user-id'; // In production, decode JWT to get user ID

    const notifications = await notificationService.getNotifications(userId);
    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/unread-count', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');
    const userId = 'admin-user-id'; // In production, decode JWT to get user ID

    const count = await notificationService.getUnreadCount(userId);
    res.json({ count });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/read', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');
    const userId = 'admin-user-id'; // In production, decode JWT to get user ID

    await notificationService.markAsRead(req.params.id, userId);
    res.json({ success: true });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

router.patch('/read-all', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');
    const userId = 'admin-user-id'; // In production, decode JWT to get user ID

    await notificationService.markAllAsRead(userId);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');
    const userId = 'admin-user-id'; // In production, decode JWT to get user ID

    await notificationService.delete(req.params.id, userId);
    res.json({ success: true });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

export default router;
