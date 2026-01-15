import { Request, Response } from 'express';
import * as vehicleService from '../services/vehicleService';
import { uploadMultipleToCloudinary, deleteMultipleFromCloudinary } from '../config/cloudinary';

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await vehicleService.getVehicles(req.query as any);
    res.json(vehicles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    res.json(vehicle);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleData = { ...req.body };

    const files = (req as any).files as Express.Multer.File[];
    if (files && files.length > 0) {
      const uploadedImages = await uploadMultipleToCloudinary(files);
      vehicleData.images = uploadedImages.map(img => img.url);
      vehicleData.imageUrl = uploadedImages[0].url;
      vehicleData.imagePublicIds = uploadedImages.map(img => img.publicId);
    } else if (vehicleData.imageUrl) {
      vehicleData.images = [vehicleData.imageUrl];
    }

    const vehicle = await vehicleService.createVehicle(vehicleData);
    res.status(201).json(vehicle);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleData = { ...req.body };

    const files = (req as any).files as Express.Multer.File[];
    if (files && files.length > 0) {
      const existingVehicle = await vehicleService.getVehicleById(req.params.id);
      if (existingVehicle.imagePublicIds && existingVehicle.imagePublicIds.length > 0) {
        await deleteMultipleFromCloudinary(existingVehicle.imagePublicIds);
      }

      const uploadedImages = await uploadMultipleToCloudinary(files);
      vehicleData.images = uploadedImages.map(img => img.url);
      vehicleData.imageUrl = uploadedImages[0].url;
      vehicleData.imagePublicIds = uploadedImages.map(img => img.publicId);
    } else if (!vehicleData.imageUrl && !vehicleData.images) {
      const existingVehicle = await vehicleService.getVehicleById(req.params.id);
      vehicleData.imageUrl = existingVehicle.imageUrl;
      vehicleData.images = existingVehicle.images || [existingVehicle.imageUrl];
    }

    const vehicle = await vehicleService.updateVehicle(req.params.id, vehicleData);
    res.json(vehicle);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    if (vehicle.imagePublicIds && vehicle.imagePublicIds.length > 0) {
      await deleteMultipleFromCloudinary(vehicle.imagePublicIds);
    }
    const result = await vehicleService.deleteVehicle(req.params.id);
    res.json(result);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const getFeaturedVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await vehicleService.getFeaturedVehicles();
    res.json(vehicles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
