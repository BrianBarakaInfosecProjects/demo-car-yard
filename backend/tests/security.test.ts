import { api, getAdminToken, getUserToken, authHeader } from './helpers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const adminToken = getAdminToken();

let testVehicleId: string;

beforeAll(async () => {
  const v = await prisma.vehicle.create({
    data: {
      make: 'Toyota',
      model: 'Security Test',
      year: 2022,
      priceKES: 3500000,
      slug: 'test-security-vehicle',
      status: 'AVAILABLE',
      mileage: 10000,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      bodyType: 'SUV',
      viewCount: 0,
      description: 'Test vehicle',
      imageUrl: '/test.jpg',
      images: '[]',
      imagePublicIds: '[]',
      drivetrain: '4WD',
      exteriorColor: 'Black',
      interiorColor: 'Black',
      engine: '2.0L',
    }
  });
  testVehicleId = v.id;
});

afterAll(async () => {
  await prisma.vehicle.deleteMany({
    where: { slug: { contains: 'test-security' }}
  });
});

describe('Security boundaries', () => {

  const adminOnlyRoutes = [
    { method: 'get', path: '/api/inquiries' },
    { method: 'get', path: '/api/analytics/dashboard' },
    { method: 'delete', path: `/api/vehicles/${testVehicleId}` },
    { method: 'patch', path: '/api/settings' },
    { method: 'get', path: '/api/reservations' },
  ];

  adminOnlyRoutes.forEach(({ method, path }) => {
    it(`${method.toUpperCase()} ${path} blocked without auth`, async () => {
      const res = await (api as any)[method](path);
      expect([401, 403]).toContain(res.status);
    });
  });

  it('user cannot access another users reservation by ID swap', async () => {
    const token1 = getUserToken('user-aaa');
    const token2 = getUserToken('user-bbb');

    const create = await api
      .post('/api/reservations')
      .send({ 
        vehicleId: testVehicleId, 
        buyerName: 'Test User',
        buyerPhone: '+254700000001',
        amount: 2000 
      });

    if (create.status === 201) {
      const steal = await api
        .get(`/api/reservations/${create.body.reservation?.id || 'invalid'}`)
        .set(authHeader(token2));

      expect([401, 403, 404]).toContain(steal.status);
    }
  });

  it('vehicle search does not crash on SQL injection attempt', async () => {
    const res = await api
      .get("/api/vehicles?make=Toyota'; DROP TABLE vehicles; --");
    expect(res.status).not.toBe(500);
  });

  it('responses include security headers', async () => {
    const res = await api.get('/api/vehicles');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  it('500 errors do not expose stack traces', async () => {
    const res = await api.get('/api/vehicles/trigger-500-if-any');
    if (res.status === 500) {
      expect(res.body.stack).toBeUndefined();
    }
  });
});
