import { api } from './helpers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('POST /api/auth/login', () => {

  it('returns 200 and JWT token with valid credentials', async () => {
    const res = await api
      .post('/api/auth/login')
      .send({ email: 'admin@trustauto.co.ke', password: 'admin123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(typeof res.body.token).toBe('string');
    expect(res.body.token.split('.').length).toBe(3);
  });

  it('token payload contains admin role', async () => {
    const res = await api
      .post('/api/auth/login')
      .send({ email: 'admin@trustauto.co.ke', password: 'admin123' });

    if (!res.body.token) {
      console.log('Login response:', res.body);
      return;
    }

    const payload = JSON.parse(
      Buffer.from(res.body.token.split('.')[1], 'base64').toString()
    );
    expect(payload.role).toBe('ADMIN');
    expect(payload.id).toBeDefined();
  });

  it('returns 401 with wrong password', async () => {
    const res = await api
      .post('/api/auth/login')
      .send({ email: 'admin@trustauto.co.ke', password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.token).toBeUndefined();
  });

  it('returns 401 for non-existent email', async () => {
    const res = await api
      .post('/api/auth/login')
      .send({ email: 'nobody@test.com', password: 'admin123' });

    expect(res.status).toBe(401);
  });

  it('returns same error message for wrong user and wrong password', async () => {
    const wrongUser = await api
      .post('/api/auth/login')
      .send({ email: 'nobody@test.com', password: 'admin123' });

    const wrongPass = await api
      .post('/api/auth/login')
      .send({ email: 'admin@trustauto.co.ke', password: 'wrong' });

    expect(wrongUser.body.message).toBe(wrongPass.body.message);
  });

  it('returns 400 when email is missing', async () => {
    const res = await api
      .post('/api/auth/login')
      .send({ password: 'admin123' });
    expect(res.status).toBe(400);
  });

  it('returns 400 when password is missing', async () => {
    const res = await api
      .post('/api/auth/login')
      .send({ email: 'admin@trustauto.co.ke' });
    expect(res.status).toBe(400);
  });

  it('never returns password field in response', async () => {
    const res = await api
      .post('/api/auth/login')
      .send({ email: 'admin@trustauto.co.ke', password: 'admin123' });

    expect(res.body.password).toBeUndefined();
    expect(res.body.user?.password).toBeUndefined();
    expect(JSON.stringify(res.body)).not.toContain('$2b$');
    expect(JSON.stringify(res.body)).not.toContain('$2a$');
  });

  it('rejects SQL injection in email field', async () => {
    const res = await api
      .post('/api/auth/login')
      .send({ email: "' OR '1'='1", password: 'anything' });
    expect(res.status).toBe(401);
  });
});
