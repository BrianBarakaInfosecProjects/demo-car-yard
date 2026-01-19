import prisma from '../config/database';

export interface CreateNotificationInput {
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  message: string;
  userId: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  vehicleId?: string;
}

export const notificationService = {
  create: async (input: CreateNotificationInput) => {
    const notification = await prisma.notification.create({
      data: {
        type: input.type,
        message: input.message,
        userId: input.userId,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        vehicleId: input.vehicleId,
      },
    });

    return notification;
  },

  getUnreadCount: async (userId: string) => {
    const count = await prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });

    return count;
  },

  getNotifications: async (userId: string, limit: number = 20) => {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return notifications;
  },

  markAsRead: async (notificationId: string, userId: string) => {
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    return updated;
  },

  markAllAsRead: async (userId: string) => {
    await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
      },
    });
  },

  delete: async (notificationId: string, userId: string) => {
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });
  },
};
