import { Router, Request, Response } from 'express';
import prisma from '../config/database';

const router = Router();

const CACHE_TTL_MS = 1000 * 60 * 60;

let makesCache: any[] | null = null;
let makesCacheTime = 0;

const modelsCache = new Map<string, { data: any; time: number }>();

router.get('/makes', async (req: Request, res: Response) => {
  try {
    if (makesCache && Date.now() - makesCacheTime < CACHE_TTL_MS) {
      return res.json({
        success: true,
        data: makesCache
      });
    }

    const makes = await prisma.carMake.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { models: true }
        }
      }
    });

    const data = makes.map(make => ({
      id: make.id,
      name: make.name,
      key: make.key,
      logoUrl: make.logoUrl,
      modelCount: make._count.models
    }));

    makesCache = data;
    makesCacheTime = Date.now();

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching car makes:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch car makes' }
    });
  }
});

router.get('/makes/:makeId/models', async (req: Request, res: Response) => {
  try {
    const { makeId } = req.params;

    const cached = modelsCache.get(makeId);
    if (cached && Date.now() - cached.time < CACHE_TTL_MS) {
      return res.json({
        success: true,
        data: cached.data
      });
    }

    const models = await prisma.carModel.findMany({
      where: { makeId },
      orderBy: { name: 'asc' }
    });

    const data = models.map(model => ({
      id: model.id,
      makeId: model.makeId,
      name: model.name,
      yearStart: model.yearStart,
      yearEnd: model.yearEnd,
      bodyTypes: JSON.parse(model.bodyTypes || '[]'),
      fuelTypes: JSON.parse(model.fuelTypes || '[]'),
      transmissions: JSON.parse(model.transmissions || '[]'),
      engines: JSON.parse(model.engines || '[]')
    }));

    modelsCache.set(makeId, { data, time: Date.now() });

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching car models:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch car models' }
    });
  }
});

router.get('/models/:modelId', async (req: Request, res: Response) => {
  try {
    const { modelId } = req.params;

    const model = await prisma.carModel.findUnique({
      where: { id: modelId },
      include: {
        make: true
      }
    });

    if (!model) {
      return res.status(404).json({
        success: false,
        error: { message: 'Car model not found' }
      });
    }

    res.json({
      success: true,
      data: {
        id: model.id,
        makeId: model.makeId,
        makeName: model.make.name,
        name: model.name,
        yearStart: model.yearStart,
        yearEnd: model.yearEnd,
        bodyTypes: JSON.parse(model.bodyTypes || '[]'),
        fuelTypes: JSON.parse(model.fuelTypes || '[]'),
        transmissions: JSON.parse(model.transmissions || '[]'),
        engines: JSON.parse(model.engines || '[]')
      }
    });
  } catch (error) {
    console.error('Error fetching car model:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch car model' }
    });
  }
});

export default router;
