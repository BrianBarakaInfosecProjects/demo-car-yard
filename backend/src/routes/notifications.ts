import { Router, Response } from 'express';
import { notificationService } from '../services/notificationService';
import { auth, AuthRequest } from '../middleware/auth';

const router = Router();

const getUserId = (req: AuthRequest): string => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new Error('Unauthorized');
  }
  return userId;
};

router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    const notifications = await notificationService.getNotifications(userId);
    res.json(notifications);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.status(500).json({ error: error.message });
  }
});

router.get('/unread-count', auth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    const count = await notificationService.getUnreadCount(userId);
    res.json({ count });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/read', auth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    await notificationService.markAsRead(req.params.id, userId);
    res.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.status(404).json({ error: error.message });
  }
});

router.patch('/read-all', auth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    await notificationService.markAllAsRead(userId);
    res.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    await notificationService.delete(req.params.id, userId);
    res.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.status(404).json({ error: error.message });
  }
});

export default router;
