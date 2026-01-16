import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as authService from '../services/authService';
import { registerSchema, loginSchema } from '../utils/validators';

export const register = async (req: Request, res: Response) => {
  try {
    const input = registerSchema.parse(req.body);
    const result = await authService.register(input);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const input = loginSchema.parse(req.body);
    const ipAddress = (req as any).ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    const result = await authService.login(input, ipAddress, userAgent);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await authService.getProfile(req.user.userId);
    res.json(user);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await authService.updateProfile(req.user.userId, req.body);
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const ipAddress = (req as any).ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    const result = await authService.logout(
      req.user.userId,
      req.user.email,
      req.user.role,
      ipAddress,
      userAgent
    );
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
