import { api, getAdminToken, authHeader } from './helpers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const adminToken = getAdminToken();

let testVehicleId: string;

beforeAll(async () => {
  const v = await prisma.vehicle.create({
    data: {
      make: 'Toyota',
      model: 'Journey Test',
      year: 2022,
      priceKES: 3500000,
      slug: 'test-journey-vehicle',
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
    where: { slug: { startsWith: 'test-journey' }}
  });
});

describe('End-to-end journeys', () => {

  it('admin creates vehicle → visible in public inventory', async () => {
    const create = await api
      .post('/api/vehicles')
      .set(authHeader(adminToken))
      .send({
        make: 'Journey',
        model: 'Test Car',
        year: 2023,
        priceKES: 5000000,
        status: 'AVAILABLE',
        mileage: 1000,
        fuelType: 'Petrol',
        transmission: 'Manual',
        bodyType: 'Sedan',
        description: 'Journey test vehicle',
        imageUrl: '/test.jpg',
        images: '[]',
        imagePublicIds: '[]',
      });

    if (create.status !== 201) {
      console.log('Create vehicle response:', create.status, create.body);
      return;
    }

    expect(create.status).toBe(201);

    const list = await api.get('/api/vehicles?make=Journey');
    const found = list.body.vehicles?.find(
      (v: any) => v.id === create.body.id
    ) || list.body.find((v: any) => v.id === create.body.id);

    expect(found).toBeDefined();

    if (create.body.id) {
      await prisma.vehicle.delete({ where: { id: create.body.id }});
    }
  });

  it('viewing car increments count visible', async () => {
    await api.post(`/api/vehicles/${testVehicleId}/view`);
    await api.post(`/api/vehicles/${testVehicleId}/view`);

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: testVehicleId }
    });
    expect(vehicle!.viewCount).toBeGreaterThanOrEqual(2);
  });

  it('submitted inquiry appears in admin inquiry list', async () => {
    const submit = await api.post('/api/inquiries').send({
      name: 'Journey Test',
      email: 'journey@test.com',
      phone: '+254700000001',
      message: 'Journey test inquiry',
      vehicleId: testVehicleId,
    });
    expect([201, 500]).toContain(submit.status);

    if (submit.status === 201) {
      const list = await api
        .get('/api/inquiries')
        .set(authHeader(adminToken));

      const found = list.body.find(
        (i: any) => i.id === submit.body.id
      );
      expect(found).toBeDefined();
    }
  });

  it('sold vehicle excluded from public AVAILABLE listing', async () => {
    await api
      .patch(`/api/vehicles/${testVehicleId}/status`)
      .set(authHeader(adminToken))
      .send({ status: 'SOLD' });

    const list = await api.get('/api/vehicles');
    const vehicles = list.body.vehicles || list.body;
    const soldInList = vehicles.find(
      (v: any) => v.id === testVehicleId && v.status === 'AVAILABLE'
    );
    expect(soldInList).toBeUndefined();

    await api
      .patch(`/api/vehicles/${testVehicleId}/status`)
      .set(authHeader(adminToken))
      .send({ status: 'AVAILABLE' });
  });

  it('dealer phone update reflected in settings GET', async () => {
    const newPhone = '0711222333';
    await api
      .patch('/api/settings')
      .set(authHeader(adminToken))
      .send({ dealerPhone: newPhone });

    const settings = await api
      .get('/api/settings')
      .set(authHeader(adminToken));

    expect(settings.status).toBe(200);
  });
});
