import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getSessionLogs as getSessionLogsService } from '../services/sessionLogService';
import { getAuditLogs as getAuditLogsService } from '../services/analyticsService';

export const getSessionLogs = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const username = req.query.username as string;
    const eventType = req.query.eventType as string;
    const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined;
    const dateTo = req.query.dateTo ? new Date(req.query.dateTo as string) : undefined;
    const ipAddress = req.query.ipAddress as string;

    const result = await getSessionLogsService(
      {
        username,
        eventType,
        dateFrom,
        dateTo,
        ipAddress,
      },
      page,
      limit
    );

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const username = req.query.username as string;
    const action = req.query.action as string;
    const entityType = req.query.entityType as string;
    const entityId = req.query.entityId as string;
    const ipAddress = req.query.ipAddress as string;

    const logs = await getAuditLogsService(limit);

    let filteredLogs = logs;

    if (username) {
      filteredLogs = filteredLogs.filter(
        (log: any) =>
          log.user.email.toLowerCase().includes(username.toLowerCase()) ||
          log.user.name?.toLowerCase().includes(username.toLowerCase())
      );
    }

    if (action) {
      filteredLogs = filteredLogs.filter((log: any) => log.action === action);
    }

    if (entityType) {
      filteredLogs = filteredLogs.filter((log: any) => log.entityType === entityType);
    }

    if (entityId) {
      filteredLogs = filteredLogs.filter((log: any) => log.entityId === entityId);
    }

    if (ipAddress) {
      filteredLogs = filteredLogs.filter((log: any) => log.ipAddress === ipAddress);
    }

    res.json(filteredLogs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllLogs = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const logType = req.query.logType as string;

    const sessionLogs = await getSessionLogsService(
      {
        username: req.query.username as string,
        eventType: req.query.eventType as string,
        dateFrom: req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined,
        dateTo: req.query.dateTo ? new Date(req.query.dateTo as string) : undefined,
        ipAddress: req.query.ipAddress as string,
      },
      page,
      limit
    );

    const auditLogs = await getAuditLogsService(limit * page);

    let filteredAuditLogs = auditLogs;

    if (req.query.username) {
      filteredAuditLogs = filteredAuditLogs.filter(
        (log: any) =>
          log.user.email.toLowerCase().includes((req.query.username as string).toLowerCase()) ||
          log.user.name?.toLowerCase().includes((req.query.username as string).toLowerCase())
      );
    }

    if (req.query.action) {
      filteredAuditLogs = filteredAuditLogs.filter((log: any) => log.action === req.query.action);
    }

    if (req.query.entityType) {
      filteredAuditLogs = filteredAuditLogs.filter((log: any) => log.entityType === req.query.entityType);
    }

    if (req.query.entityId) {
      filteredAuditLogs = filteredAuditLogs.filter((log: any) => log.entityId === req.query.entityId);
    }

    if (req.query.ipAddress) {
      filteredAuditLogs = filteredAuditLogs.filter((log: any) => log.ipAddress === req.query.ipAddress);
    }

    const auditLogsPaginated = filteredAuditLogs.slice((page - 1) * limit, page * limit);

    let result;
    if (logType === 'session') {
      result = sessionLogs;
    } else if (logType === 'audit') {
      result = {
        logs: auditLogsPaginated,
        pagination: {
          page,
          limit,
          total: filteredAuditLogs.length,
          totalPages: Math.ceil(filteredAuditLogs.length / limit),
        },
      };
    } else {
      result = {
        sessionLogs: sessionLogs.logs,
        auditLogs: auditLogsPaginated,
        pagination: sessionLogs.pagination,
      };
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
