import { Router, Request, Response } from 'express';
import prisma from '../config/database';
import { auth, adminOnly, AuthRequest } from '../middleware/auth';

const router = Router();

export const createReservation = async (req: Request, res: Response) => {
  try {
    const { vehicleId, buyerName, buyerPhone, checkoutRequestId, amount = 500 } = req.body;

    if (!vehicleId || !buyerName || !buyerPhone) {
      return res.status(400).json({ error: 'vehicleId, buyerName, and buyerPhone are required' });
    }

    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    const reservation = await prisma.reservation.create({
      data: {
        vehicleId,
        buyerName,
        buyerPhone,
        amount,
        checkoutRequestId,
        status: 'PENDING',
        expiresAt,
      },
    });

    res.json({ success: true, reservation });
  } catch (error: any) {
    console.error('Create reservation error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getReservations = async (req: AuthRequest, res: Response) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            year: true,
            slug: true,
            imageUrl: true,
            priceKES: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(reservations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getActiveReservation = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    
    const reservation = await prisma.reservation.findFirst({
      where: {
        vehicleId,
        status: 'ACTIVE',
        expiresAt: { gt: new Date() },
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

    res.json(reservation);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const confirmReservation = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { mpesaReceipt } = req.body;

    const reservation = await prisma.reservation.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        mpesaReceipt,
      },
    });

    await prisma.vehicle.update({
      where: { id: reservation.vehicleId },
      data: {
        status: 'RESERVED',
      },
    });

    res.json({ success: true, reservation });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const expireReservation = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.reservation.update({
      where: { id },
      data: { status: 'EXPIRED' },
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getExpiringReservations = async (req: AuthRequest, res: Response) => {
  try {
    const sixHoursFromNow = new Date(Date.now() + 6 * 60 * 60 * 1000);
    const now = new Date();

    const expiring = await prisma.reservation.findMany({
      where: {
        status: 'ACTIVE',
        expiresAt: {
          gt: now,
          lte: sixHoursFromNow,
        },
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

    res.json(expiring);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Public route - buyer creates reservation
router.post('/', createReservation);

// Public route - check if vehicle has active reservation
router.get('/active/:vehicleId', getActiveReservation);

// Admin-only routes - require authentication and admin/staff role
router.get('/', auth, adminOnly, getReservations);
router.get('/expiring', auth, adminOnly, getExpiringReservations);
router.patch('/:id/confirm', auth, adminOnly, confirmReservation);
router.patch('/:id/expire', auth, adminOnly, expireReservation);

export default router;
