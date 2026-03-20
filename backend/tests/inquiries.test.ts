import { api, getAdminToken, authHeader } from './helpers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const adminToken = getAdminToken();

let testVehicleId: string;

beforeAll(async () => {
  const v = await prisma.vehicle.create({
    data: {
      make: 'Toyota',
      model: 'Inquiry Test',
      year: 2022,
      priceKES: 3500000,
      slug: 'test-inquiry-vehicle',
      status: 'AVAILABLE',
      mileage: 10000,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      bodyType: 'SUV',
      viewCount: 0,
      description: 'Test vehicle for inquiries',
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
    where: { slug: { contains: 'test-inquiry' }}
  });
  await prisma.inquiry.deleteMany({
    where: { email: { contains: '@test.com' }}
  });
});

describe('POST /api/inquiries', () => {

  it('creates inquiry and saves to database', async () => {
    const payload = {
      name: 'Test User',
      email: 'testuser@test.com',
      phone: '+254712345678',
      message: 'Interested in the Prado',
      vehicleId: testVehicleId,
    };

    const res = await api.post('/api/inquiries').send(payload);

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();

    const inquiry = await prisma.inquiry.findUnique({
      where: { id: res.body.id }
    });
    expect(inquiry).not.toBeNull();
    expect(inquiry!.email).toBe(payload.email);
  });

  it('returns 400 when name is missing', async () => {
    const res = await api.post('/api/inquiries').send({
      email: 'test@test.com', message: 'hi'
    });
    expect(res.status).toBe(400);
  });

  it('returns 400 when email is missing', async () => {
    const res = await api.post('/api/inquiries').send({
      name: 'Test', message: 'hi'
    });
    expect(res.status).toBe(400);
  });

  it('rate limits after 5 requests from same IP', async () => {
    const payload = {
      name: 'Spam Test',
      email: 'spam@test.com',
      phone: '0700000000',
      message: 'test'
    };

    const results = await Promise.all(
      Array.from({ length: 6 }, () =>
        api.post('/api/inquiries').send(payload)
      )
    );

    const statuses = results.map(r => r.status);
    expect(statuses).toContain(429);
  });

  it('GET /api/inquiries returns list for admin', async () => {
    const res = await api
      .get('/api/inquiries')
      .set(authHeader(adminToken));
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/inquiries returns 401 without token', async () => {
    const res = await api.get('/api/inquiries');
    expect(res.status).toBe(401);
  });
});
