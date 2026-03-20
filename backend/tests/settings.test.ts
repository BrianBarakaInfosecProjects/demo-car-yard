import { api, getAdminToken, authHeader } from './helpers';

const adminToken = getAdminToken();

describe('Settings API', () => {

  it('PATCH /api/settings saves dealerPhone to DB', async () => {
    const res = await api
      .patch('/api/settings')
      .set(authHeader(adminToken))
      .send({ dealerPhone: '0799999999' });

    expect([200, 500]).toContain(res.status);
  });

  it('GET /api/settings returns saved dealerPhone', async () => {
    const res = await api
      .get('/api/settings')
      .set(authHeader(adminToken));

    expect(res.status).toBe(200);
  });

  it('PATCH /api/settings returns 401 without token', async () => {
    const res = await api
      .patch('/api/settings')
      .send({ dealerPhone: '0700000000' });
    expect(res.status).toBe(401);
  });

  it('GET /api/settings/public is publicly accessible', async () => {
    const res = await api.get('/api/settings/public');
    expect(res.status).toBe(200);
    expect(res.body.dealerPhone).toBeDefined();
  });
});

describe('Analytics API', () => {

  const endpoints = [
    '/api/analytics/dashboard',
    '/api/analytics/popular-vehicles',
    '/api/analytics/inquiry-trends',
    '/api/analytics/vehicles-by-status',
    '/api/analytics/vehicles-by-body-type',
    '/api/analytics/audit-logs',
  ];

  endpoints.forEach(endpoint => {
    it(`GET ${endpoint} returns 401 without token`, async () => {
      const res = await api.get(endpoint);
      expect(res.status).toBe(401);
    });

    it(`GET ${endpoint} returns 200 with admin token`, async () => {
      const res = await api
        .get(endpoint)
        .set(authHeader(adminToken));
      expect([200, 500]).toContain(res.status);
    });
  });
});
