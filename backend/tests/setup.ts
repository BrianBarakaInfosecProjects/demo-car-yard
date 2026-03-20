import { beforeAll, afterAll } from '@jest/globals';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  try {
    await prisma.inquiry.deleteMany({ where: { email: { contains: '@test.com' }}});
    await prisma.vehicle.deleteMany({ where: { slug: { contains: 'test-' }}});
    await prisma.softInterest.deleteMany({ where: { phone: { contains: '+254' }}});
    await prisma.reservation.deleteMany({ where: { buyerPhone: { contains: '+254' }}});
  } catch (e) {
    console.log('Cleanup error (may be expected):', e);
  }
  await prisma.$disconnect();
});

export { prisma };
