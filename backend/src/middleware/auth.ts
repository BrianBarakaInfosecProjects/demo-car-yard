import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/token';
import { logSessionExpired } from '../services/sessionLogService';
import jwt from 'jsonwebtoken';

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
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      try {
        const decoded = jwt.decode(token) as any;
        if (decoded && decoded.userId && decoded.email && decoded.role) {
          const ipAddress = (req as any).ip || req.socket.remoteAddress || 'unknown';
          const userAgent = req.headers['user-agent'] || 'unknown';

          if (error instanceof jwt.TokenExpiredError) {
            logSessionExpired(decoded.userId, decoded.email, decoded.role, ipAddress, userAgent);
          }
        }
      } catch (decodeError) {
        console.error('Failed to decode token for logging:', decodeError);
      }
    }

    res.status(401).json({ error: 'Invalid token' });
  }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN' && req.user?.role !== 'STAFF') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
