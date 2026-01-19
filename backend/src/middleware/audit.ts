import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuthRequest } from './auth';
import {
  shouldLogAuditEvent,
  getBeforeStateForLog,
  getAfterStateForLog,
  getChangesForLog,
  getIpAddressForLog,
} from '../config/features';

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

    res.json = function(data: any) {
      const authReq = req as AuthRequest;

      if (authReq.user && res.statusCode < 400) {
        const mappedAction = ACTION_MAP[action] || action;

        if (!shouldLogAuditEvent(mappedAction)) {
          const result = oldJson.call(this, data);
          res.json = oldJson;
          return result;
        }

        const entityId = req.params.id || (data.id && typeof data.id === 'string' ? data.id : null) || null;

        let beforeState: string | null = null;
        let afterState: string | null = null;

        const doAsyncAudit = async () => {
          if (entityType === 'VEHICLE' && entityId) {
            if (action === 'UPDATE' || action === 'DELETE') {
              try {
                const existingVehicle = await prisma.vehicle.findUnique({
                  where: { id: entityId },
                });
                if (existingVehicle) {
                  const beforeStateVal = getBeforeStateForLog(JSON.stringify(existingVehicle));
                  beforeState = beforeStateVal !== undefined ? beforeStateVal : null;
                }
              } catch (err) {
                console.error('Failed to fetch before state:', err);
              }
            }
          }

          if (data.vehicle) {
            const afterStateVal = getAfterStateForLog(JSON.stringify(data.vehicle));
            afterState = afterStateVal !== undefined ? afterStateVal : null;
          } else if (entityType === 'VEHICLE' && entityId) {
            try {
              const updatedVehicle = await prisma.vehicle.findUnique({
                where: { id: entityId },
              });
              if (updatedVehicle) {
                const afterStateVal = getAfterStateForLog(JSON.stringify(updatedVehicle));
                afterState = afterStateVal !== undefined ? afterStateVal : null;
              }
            } catch (err) {
              console.error('Failed to fetch after state:', err);
            }
          }

          const changesVal = getChangesForLog(req.body ? JSON.stringify(req.body) : undefined);
          const changes = changesVal !== undefined ? changesVal : null;
          const ipAddressVal = getIpAddressForLog(req.ip || req.socket.remoteAddress || 'unknown');
          const ipAddress = ipAddressVal !== undefined ? ipAddressVal : null;

          prisma.auditLog.create({
            data: {
              action: mappedAction,
              entityType,
              entityId,
              changes,
              beforeState,
              afterState,
              userId: authReq.user!.userId,
              vehicleId: entityType === 'VEHICLE' ? entityId : null,
              inquiryId: entityType === 'INQUIRY' ? entityId : null,
              ipAddress,
            },
          }).catch((err) => console.error('Audit logging failed:', err));
        };

        doAsyncAudit().catch((err) => console.error('Audit async error:', err));
      }

      const result = oldJson.call(this, data);
      res.json = oldJson;
      return result;
    };

    next();
  };
};