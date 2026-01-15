import { Request, Response } from 'express';
import * as analyticsService from '../services/analyticsService';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const stats = await analyticsService.getDashboardStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPopularVehicles = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const vehicles = await analyticsService.getPopularVehicles(limit);
    res.json(vehicles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getInquiryTrends = async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const trends = await analyticsService.getInquiryTrends(days);
    res.json(trends);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getVehicleStatsByStatus = async (req: Request, res: Response) => {
  try {
    const stats = await analyticsService.getVehicleStatsByStatus();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getVehicleStatsByBodyType = async (req: Request, res: Response) => {
  try {
    const stats = await analyticsService.getVehicleStatsByBodyType();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const logs = await analyticsService.getRecentAuditLogs(limit);
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};