import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuthRequest } from './auth';

export const auditLogger = (action: string, entityType: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const oldJson = res.json;
    
    res.json = function(data: any) {
      const authReq = req as AuthRequest;
      
      if (authReq.user && res.statusCode < 400) {
        const entityId = req.params.id || (data.id && typeof data.id === 'string' ? data.id : undefined);
        
        let changes = null;
        if (action === 'UPDATE' && req.body) {
          changes = JSON.stringify(req.body);
        }

        prisma.auditLog.create({
          data: {
            action,
            entityType,
            entityId,
            changes,
            userId: authReq.user.userId,
            vehicleId: entityType === 'VEHICLE' ? entityId : undefined,
            inquiryId: entityType === 'INQUIRY' ? entityId : undefined,
            ipAddress: req.ip || req.socket.remoteAddress || 'unknown',
          },
        }).catch((err) => console.error('Audit logging failed:', err));
      }

      return oldJson.call(this, data);
    };

    next();
  };
};