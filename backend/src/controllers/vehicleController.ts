import { Request, Response } from 'express';
import * as vehicleService from '../services/vehicleService';

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
    const vehicle = await vehicleService.createVehicle(req.body);
    res.status(201).json(vehicle);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
    res.json(vehicle);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
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
