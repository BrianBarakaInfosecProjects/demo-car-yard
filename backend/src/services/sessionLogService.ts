import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export interface SessionLogInput {
  eventType: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'LOGOUT' | 'SESSION_EXPIRED';
  userId?: string;
  username?: string;
  role?: string;
  ipAddress?: string;
  userAgent?: string;
  sessionStart?: Date;
  sessionEnd?: Date;
}

export const logLoginSuccess = async (
  userId: string,
  username: string,
  role: string,
  ipAddress: string,
  userAgent: string
) => {
  try {
    await prisma.sessionLog.create({
      data: {
        eventType: 'LOGIN_SUCCESS',
        userId,
        username,
        role,
        ipAddress,
        userAgent,
        sessionStart: new Date(),
      },
    });
  } catch (error) {
    console.error('Failed to log login success:', error);
  }
};

export const logLoginFailed = async (
  username: string,
  ipAddress: string,
  userAgent: string
) => {
  try {
    await prisma.sessionLog.create({
      data: {
        eventType: 'LOGIN_FAILED',
        username,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error('Failed to log login failed:', error);
  }
};

export const logLogout = async (
  userId: string,
  username: string,
  role: string,
  ipAddress: string,
  userAgent: string
) => {
  try {
    const latestLogin = await prisma.sessionLog.findFirst({
      where: {
        userId,
        eventType: 'LOGIN_SUCCESS',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const sessionStart = latestLogin?.sessionStart || latestLogin?.createdAt;
    const sessionEnd = new Date();
    const sessionDuration = sessionStart
      ? Math.floor((sessionEnd.getTime() - sessionStart.getTime()) / 1000)
      : null;

    await prisma.sessionLog.create({
      data: {
        eventType: 'LOGOUT',
        userId,
        username,
        role,
        ipAddress,
        userAgent,
        sessionStart,
        sessionEnd,
        sessionDuration,
      },
    });
  } catch (error) {
    console.error('Failed to log logout:', error);
  }
};

export const logSessionExpired = async (
  userId: string,
  username: string,
  role: string,
  ipAddress: string,
  userAgent: string
) => {
  try {
    const latestLogin = await prisma.sessionLog.findFirst({
      where: {
        userId,
        eventType: 'LOGIN_SUCCESS',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const sessionStart = latestLogin?.sessionStart || latestLogin?.createdAt;
    const sessionEnd = new Date();
    const sessionDuration = sessionStart
      ? Math.floor((sessionEnd.getTime() - sessionStart.getTime()) / 1000)
      : null;

    await prisma.sessionLog.create({
      data: {
        eventType: 'SESSION_EXPIRED',
        userId,
        username,
        role,
        ipAddress,
        userAgent,
        sessionStart,
        sessionEnd,
        sessionDuration,
      },
    });
  } catch (error) {
    console.error('Failed to log session expired:', error);
  }
};

export interface SessionLogFilters {
  username?: string;
  eventType?: string;
  dateFrom?: Date;
  dateTo?: Date;
  ipAddress?: string;
}

export const getSessionLogs = async (
  filters: SessionLogFilters = {},
  page: number = 1,
  limit: number = 20
) => {
  const where: any = {};

  if (filters.username) {
    where.username = {
      contains: filters.username,
      mode: 'insensitive',
    };
  }

  if (filters.eventType) {
    where.eventType = filters.eventType;
  }

  if (filters.dateFrom || filters.dateTo) {
    where.createdAt = {};
    if (filters.dateFrom) {
      where.createdAt.gte = filters.dateFrom;
    }
    if (filters.dateTo) {
      where.createdAt.lte = filters.dateTo;
    }
  }

  if (filters.ipAddress) {
    where.ipAddress = {
      contains: filters.ipAddress,
    };
  }

  const [logs, total] = await Promise.all([
    prisma.sessionLog.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
      },
    }),
    prisma.sessionLog.count({ where }),
  ]);

  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
