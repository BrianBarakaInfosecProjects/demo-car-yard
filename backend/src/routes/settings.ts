import { Router } from 'express';
import { auth, adminOnly } from '../middleware/auth';
import prisma from '../config/database';

const router = Router();

router.get('/public', async (req, res) => {
  try {
    const setting = await prisma.settings.findUnique({
      where: { key: 'dealerPhone' },
    });
    res.json({ dealerPhone: setting?.value || '' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const settings = await prisma.settings.findMany();
    const settingsObj: Record<string, string> = {};
    settings.forEach(s => {
      settingsObj[s.key] = s.value;
    });
    res.json(settingsObj);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/', auth, adminOnly, async (req, res) => {
  try {
    const { dealerPhone, ...otherSettings } = req.body;
    
    if (dealerPhone !== undefined) {
      await prisma.settings.upsert({
        where: { key: 'dealerPhone' },
        update: { value: dealerPhone },
        create: { key: 'dealerPhone', value: dealerPhone },
      });
    }

    for (const [key, value] of Object.entries(otherSettings)) {
      if (typeof value === 'string') {
        await prisma.settings.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        });
      }
    }

    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
