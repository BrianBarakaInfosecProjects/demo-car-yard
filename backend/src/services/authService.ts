import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/passwordHash';
import { generateToken, TokenPayload } from '../utils/token';
import { RegisterInput, LoginInput } from '../utils/validators';
import { logLoginSuccess, logLoginFailed, logLogout } from './sessionLogService';

export const register = async (input: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      password: hashedPassword,
      name: input.name,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const token = generateToken(payload);

  return { user, token };
};

export const login = async (input: LoginInput, ipAddress?: string, userAgent?: string) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    await logLoginFailed(input.email, ipAddress || 'unknown', userAgent || 'unknown');
    throw new Error('Invalid credentials');
  }

  const isValid = await comparePassword(input.password, user.password);

  if (!isValid) {
    await logLoginFailed(user.email, ipAddress || 'unknown', userAgent || 'unknown');
    throw new Error('Invalid credentials');
  }

  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const token = generateToken(payload);

  await logLoginSuccess(
    user.id,
    user.email,
    user.role,
    ipAddress || 'unknown',
    userAgent || 'unknown'
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token,
  };
};

export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export const updateProfile = async (userId: string, data: { name?: string; email?: string; password?: string }) => {
  const updateData: any = {};

  if (data.name) {
    updateData.name = data.name;
  }

  if (data.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser && existingUser.id !== userId) {
      throw new Error('Email already in use');
    }
    updateData.email = data.email;
  }

  if (data.password) {
    updateData.password = await hashPassword(data.password);
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      updatedAt: true,
    },
  });

  return user;
};

export const logout = async (userId: string, username: string, role: string, ipAddress: string, userAgent: string) => {
  await logLogout(userId, username, role, ipAddress, userAgent);
  return { message: 'Logged out successfully' };
};
