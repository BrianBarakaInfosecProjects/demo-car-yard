import { Router, Request, Response } from 'express';
import prisma from '../config/database';
import { auth, adminOnly, AuthRequest } from '../middleware/auth';

const router = Router();

export const createNotifySubscriber = async (req: Request, res: Response) => {
  try {
    const { name, phone, maxBudget, intentMake, intentModel, intentMaxPrice } = req.body;

    const subscriber = await prisma.notifySubscriber.create({
      data: {
        name,
        phone,
        maxBudget: maxBudget || intentMaxPrice || 0,
        intentMake: intentMake || null,
        intentModel: intentModel || null,
        intentMaxPrice: intentMaxPrice || maxBudget || 0,
        status: 'ACTIVE',
      },
    });

    res.json({ success: true, subscriber });
  } catch (error: any) {
    console.error('Create notify subscriber error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getNotifySubscribers = async (req: AuthRequest, res: Response) => {
  try {
    const subscribers = await prisma.notifySubscriber.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(subscribers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Public route - customers subscribe to notifications
router.post('/', createNotifySubscriber);

// Admin-only route - view all subscribers
router.get('/', auth, adminOnly, getNotifySubscribers);

export default router;
