import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/token';

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN' && req.user?.role !== 'STAFF') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
