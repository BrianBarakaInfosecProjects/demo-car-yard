import request from 'supertest';
import app from '../src/app';
import jwt from 'jsonwebtoken';

export const api = request(app);

export const getAdminToken = () => {
  const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
  return jwt.sign(
    { id: 'test-admin-id', role: 'ADMIN', email: 'admin@trustauto.co.ke' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

export const getUserToken = (id = 'test-user-id') => {
  const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
  return jwt.sign(
    { id, role: 'USER', email: `${id}@test.com` },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

export const authHeader = (token: string) => ({
  Authorization: `Bearer ${token}`
});
