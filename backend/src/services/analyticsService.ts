import prisma from '../config/database';

export const getDashboardStats = async () => {
  const [
    totalVehicles,
    publishedVehicles,
    draftVehicles,
    totalInquiries,
    pendingInquiries,
    resolvedInquiries,
    totalUsers,
    featuredVehicles,
  ] = await Promise.all([
    prisma.vehicle.count(),
    prisma.vehicle.count({ where: { isDraft: false } }),
    prisma.vehicle.count({ where: { isDraft: true } }),
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: 'PENDING' } }),
    prisma.inquiry.count({ where: { status: 'RESOLVED' } }),
    prisma.user.count(),
    prisma.vehicle.count({ where: { featured: true, isDraft: false } }),
  ]);

  return {
    totalVehicles,
    publishedVehicles,
    draftVehicles,
    totalInquiries,
    pendingInquiries,
    resolvedInquiries,
    totalUsers,
    featuredVehicles,
  };
};

export const getPopularVehicles = async (limit: number = 10) => {
  const vehicles = await prisma.vehicle.findMany({
    where: { isDraft: false },
    orderBy: { viewCount: 'desc' },
    take: limit,
    select: {
      id: true,
      make: true,
      model: true,
      year: true,
      priceKES: true,
      imageUrl: true,
      viewCount: true,
      status: true,
    },
  });

  return vehicles;
};

export const getInquiryTrends = async (days: number = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const inquiries = await prisma.inquiry.findMany({
    where: {
      createdAt: {
        gte: startDate,
      },
    },
    select: {
      createdAt: true,
      status: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const dailyTrends: Record<string, { total: number; pending: number; resolved: number }> = {};

  inquiries.forEach((inquiry) => {
    const dateKey = inquiry.createdAt.toISOString().split('T')[0];
    if (!dailyTrends[dateKey]) {
      dailyTrends[dateKey] = { total: 0, pending: 0, resolved: 0 };
    }
    dailyTrends[dateKey].total++;
    if (inquiry.status === 'PENDING') dailyTrends[dateKey].pending++;
    if (inquiry.status === 'RESOLVED') dailyTrends[dateKey].resolved++;
  });

  const sortedTrends = Object.entries(dailyTrends)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, data]) => ({
      date,
      ...data,
    }));

  return sortedTrends;
};

export const getVehicleStatsByStatus = async () => {
  const statusStats = await prisma.vehicle.groupBy({
    by: ['status'],
    where: { isDraft: false },
    _count: true,
  });

  return statusStats.map((stat) => ({
    status: stat.status,
    count: stat._count,
  }));
};

export const getVehicleStatsByBodyType = async () => {
  const bodyTypeStats = await prisma.vehicle.groupBy({
    by: ['bodyType'],
    where: { isDraft: false },
    _count: true,
  });

  return bodyTypeStats.map((stat) => ({
    bodyType: stat.bodyType,
    count: stat._count,
  }));
};

export const getRecentAuditLogs = async (limit: number = 50) => {
  const logs = await prisma.auditLog.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      vehicle: {
        select: {
          make: true,
          model: true,
        },
      },
      inquiry: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return logs;
};