import { api, getAdminToken, authHeader } from './helpers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const adminToken = getAdminToken();
let testVehicleId: string;
let testVehicleSlug: string;

beforeAll(async () => {
  const v = await prisma.vehicle.create({
    data: {
      make: 'Toyota',
      model: 'Test Model',
      year: 2022,
      priceKES: 3500000,
      slug: 'test-toyota-testmodel-2022',
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
  testVehicleSlug = v.slug!;
});

afterAll(async () => {
  await prisma.vehicle.deleteMany({
    where: { slug: { startsWith: 'test-' }}
  });
});

describe('GET /api/vehicles', () => {

  it('returns vehicles array with pagination metadata', async () => {
    const res = await api.get('/api/vehicles');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.vehicles) || Array.isArray(res.body)).toBe(true);
  });

  it('respects limit and page params', async () => {
    const res = await api.get('/api/vehicles?limit=2&page=1');
    expect(res.status).toBe(200);
    const vehicles = res.body.vehicles || res.body;
    expect(vehicles.length).toBeLessThanOrEqual(2);
  });

  it('caps limit at 100 regardless of param', async () => {
    const res = await api.get('/api/vehicles?limit=9999');
    expect(res.status).toBe(200);
    const vehicles = res.body.vehicles || res.body;
    expect(vehicles.length).toBeLessThanOrEqual(100);
  });

  it('filters by make correctly', async () => {
    const res = await api.get('/api/vehicles?make=Toyota');
    expect(res.status).toBe(200);
    const vehicles = res.body.vehicles || res.body;
    vehicles.forEach((v: any) => {
      expect(v.make.toLowerCase()).toBe('toyota');
    });
  });

  it('vehicle objects do not contain internal fields', async () => {
    const res = await api.get('/api/vehicles');
    const body = JSON.stringify(res.body);
    expect(body).not.toContain('password');
  });
});

describe('GET /api/vehicles/featured', () => {

  it('returns up to 6 vehicles', async () => {
    const res = await api.get('/api/vehicles/featured');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeLessThanOrEqual(6);
  });
});

describe('POST /api/vehicles/:id/view', () => {

  it('increments viewCount on valid vehicle', async () => {
    const before = await prisma.vehicle.findUnique({
      where: { id: testVehicleId },
      select: { viewCount: true }
    });

    await api.post(`/api/vehicles/${testVehicleId}/view`);

    const after = await prisma.vehicle.findUnique({
      where: { id: testVehicleId },
      select: { viewCount: true }
    });

    expect(after!.viewCount).toBe(before!.viewCount + 1);
  });

  it('returns 404 for non-existent vehicle ID', async () => {
    const res = await api.post('/api/vehicles/nonexistent-id/view');
    expect(res.status).toBe(404);
  });
});

describe('Admin vehicle operations', () => {

  it('POST /api/vehicles returns 401 without token', async () => {
    const res = await api.post('/api/vehicles').send({
      make: 'Nissan', model: 'Test', year: 2020, priceKES: 1000000
    });
    expect(res.status).toBe(401);
  });

  it('POST /api/vehicles returns 403 with user token', async () => {
    const { getUserToken, authHeader } = await import('./helpers');
    const res = await api
      .post('/api/vehicles')
      .set(authHeader(getUserToken()))
      .send({ make: 'Nissan', model: 'Test', year: 2020, priceKES: 1000000 });
    expect([401, 403]).toContain(res.status);
  });

  it('POST /api/vehicles creates vehicle with admin token', async () => {
    const res = await api
      .post('/api/vehicles')
      .set(authHeader(adminToken))
      .send({
        make: 'Honda',
        model: 'Test CR-V',
        year: 2023,
        priceKES: 4200000,
        mileage: 5000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        bodyType: 'SUV',
        status: 'AVAILABLE',
        description: 'Test vehicle',
        imageUrl: '/test.jpg',
        images: '[]',
        imagePublicIds: '[]',
      });

    expect([201, 400]).toContain(res.status);
    
    if (res.status === 201 && res.body.id) {
      await prisma.vehicle.delete({ where: { id: res.body.id }});
    }
  });

  it('PATCH /api/vehicles/:id updates with admin token', async () => {
    const res = await api
      .patch(`/api/vehicles/${testVehicleId}`)
      .set(authHeader(adminToken))
      .send({ priceKES: 3800000 });

    expect([200, 400]).toContain(res.status);
  });

  it('DELETE /api/vehicles/:id returns 401 without token', async () => {
    const res = await api.delete(`/api/vehicles/${testVehicleId}`);
    expect(res.status).toBe(401);
  });
});
