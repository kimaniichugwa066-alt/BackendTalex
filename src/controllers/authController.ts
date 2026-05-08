import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client';
import { config } from '../config';
import { successResponse, errorResponse } from '../utils/apiResponse';
import { sendWelcomeEmail } from '../services/notificationService';

const signToken = (userId: string, role: string) => jwt.sign({ userId, role }, config.jwtSecret, { expiresIn: '7d' });

export const register = async (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body;
  try {
    const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { phone }] } });
    if (existing) {
      return res.status(409).json(errorResponse('Email or phone already in use'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, phone, password: hashedPassword, role: 'USER' },
    });

    const token = signToken(user.id, user.role);

    // Send welcome email asynchronously
    sendWelcomeEmail(user.email, user.name).catch(console.error);

    res.json(successResponse('Registration successful', { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to register user', error));
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json(errorResponse('Invalid credentials'));
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json(errorResponse('Invalid credentials'));
    }

    const token = signToken(user.id, user.role);
    res.json(successResponse('Login successful', { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }));
  } catch (error) {
    res.status(500).json(errorResponse('Login failed', error));
  }
};

export const refreshToken = async (_req: Request, res: Response) => {
  res.json(successResponse('Refresh token endpoint. Implement token refresh on the client side.'));
};

export const logout = async (_req: Request, res: Response) => {
  res.json(successResponse('Logout successful'));
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json(errorResponse('User not found'));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { email }, data: { password: hashedPassword } });
    res.json(successResponse('Password reset successful'));
  } catch (error) {
    res.status(500).json(errorResponse('Password reset failed', error));
  }
};
