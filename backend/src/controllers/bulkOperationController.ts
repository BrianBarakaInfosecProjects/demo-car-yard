import { Request, Response } from 'express';
import * as bulkOperationService from '../services/bulkOperationService';

export const bulkDeleteVehicles = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Vehicle IDs are required' });
    }

    const result = await bulkOperationService.bulkDeleteVehicles(ids);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const bulkUpdateVehicleStatus = async (req: Request, res: Response) => {
  try {
    const { ids, status } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Vehicle IDs are required' });
    }
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const result = await bulkOperationService.bulkUpdateVehicleStatus(ids, status);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const bulkUpdateVehicleLocation = async (req: Request, res: Response) => {
  try {
    const { ids, location } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Vehicle IDs are required' });
    }
    if (!location) {
      return res.status(400).json({ error: 'Location is required' });
    }

    const result = await bulkOperationService.bulkUpdateVehicleLocation(ids, location);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const bulkSetFeatured = async (req: Request, res: Response) => {
  try {
    const { ids, featured } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Vehicle IDs are required' });
    }
    if (typeof featured !== 'boolean') {
      return res.status(400).json({ error: 'Featured status is required' });
    }

    const result = await bulkOperationService.bulkSetFeatured(ids, featured);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const bulkPublishVehicles = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Vehicle IDs are required' });
    }

    const result = await bulkOperationService.bulkPublishVehicles(ids);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const bulkUnpublishVehicles = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Vehicle IDs are required' });
    }

    const result = await bulkOperationService.bulkUnpublishVehicles(ids);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};