import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuthRequest } from './auth';

const ACTION_MAP: Record<string, string> = {
  'CREATE': 'VEHICLE_CREATED',
  'UPDATE': 'VEHICLE_UPDATED',
  'DELETE': 'VEHICLE_DELETED',
  'BULK_PUBLISH': 'VEHICLE_PUBLISHED',
  'BULK_UNPUBLISH': 'VEHICLE_UNPUBLISHED',
};

export const auditLogger = (action: string, entityType: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const oldJson = res.json.bind(res);

    res.json = async function(data: any) {
      const authReq = req as AuthRequest;

      if (authReq.user && res.statusCode < 400) {
        const entityId = req.params.id || (data.id && typeof data.id === 'string' ? data.id : undefined);

        let beforeState: string | null = null;
        let afterState: string | null = null;

        if (entityType === 'VEHICLE' && entityId) {
          if (action === 'UPDATE' || action === 'DELETE') {
            try {
              const existingVehicle = await prisma.vehicle.findUnique({
                where: { id: entityId },
              });
              if (existingVehicle) {
                beforeState = JSON.stringify(existingVehicle);
              }
            } catch (err) {
              console.error('Failed to fetch before state:', err);
            }
          }
        }

        if (data.vehicle) {
          afterState = JSON.stringify(data.vehicle);
        } else if (entityType === 'VEHICLE' && entityId) {
          try {
            const updatedVehicle = await prisma.vehicle.findUnique({
              where: { id: entityId },
            });
            if (updatedVehicle) {
              afterState = JSON.stringify(updatedVehicle);
            }
          } catch (err) {
            console.error('Failed to fetch after state:', err);
          }
        }

        let changes = null;
        if (req.body) {
          changes = JSON.stringify(req.body);
        }

        const mappedAction = ACTION_MAP[action] || action;

        prisma.auditLog.create({
          data: {
            action: mappedAction,
            entityType,
            entityId,
            changes,
            beforeState,
            afterState,
            userId: authReq.user.userId,
            vehicleId: entityType === 'VEHICLE' ? entityId : undefined,
            inquiryId: entityType === 'INQUIRY' ? entityId : undefined,
            ipAddress: req.ip || req.socket.remoteAddress || 'unknown',
          },
        }).catch((err) => console.error('Audit logging failed:', err));
      }

      const result = oldJson.call(this, data);
      res.json = oldJson;
      return result;
    };

    next();
  };
};