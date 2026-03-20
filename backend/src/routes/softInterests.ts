import { Router, Request, Response } from 'express';
import prisma from '../config/database';
import { auth, adminOnly, AuthRequest } from '../middleware/auth';

const router = Router();

export const createSoftInterest = async (req: Request, res: Response) => {
  try {
    const { name, phone, vehicleId } = req.body;

    if (!name || !phone || !vehicleId) {
      return res.status(400).json({ error: 'Name, phone, and vehicleId are required' });
    }

    const softInterest = await prisma.softInterest.create({
      data: {
        name,
        phone,
        vehicleId,
        followedUp: false,
      },
    });

    res.json({ success: true, softInterest });
  } catch (error: any) {
    console.error('Create soft interest error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getSoftInterests = async (req: AuthRequest, res: Response) => {
  try {
    const softInterests = await prisma.softInterest.findMany({
      include: {
        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            year: true,
            slug: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(softInterests);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPendingFollowUps = async (req: AuthRequest, res: Response) => {
  try {
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
    
    const pending = await prisma.softInterest.findMany({
      where: {
        followedUp: false,
        createdAt: { lt: fourHoursAgo },
      },
      include: {
        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            year: true,
            slug: true,
          },
        },
      },
    });
    res.json(pending);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const markAsFollowedUp = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.softInterest.update({
      where: { id },
      data: { followedUp: true },
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Public route - customers express interest in a vehicle
router.post('/', createSoftInterest);

// Admin-only routes
router.get('/', auth, adminOnly, getSoftInterests);
router.get('/pending', auth, adminOnly, getPendingFollowUps);
router.patch('/:id/followup', auth, adminOnly, markAsFollowedUp);

export default router;
