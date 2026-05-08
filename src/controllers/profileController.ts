import { Response } from 'express';
import prisma from '../prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';
import { successResponse, errorResponse } from '../utils/apiResponse';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        headline: true,
        location: true,
        summary: true,
        experience: true,
        education: true,
        linkedIn: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json(errorResponse('Profile not found'));
    }

    res.json(successResponse('Profile loaded', { profile: user }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to load profile', error));
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;
    const user = await prisma.user.update({
      where: { id: req.user?.id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        headline: true,
        location: true,
        summary: true,
        experience: true,
        education: true,
        linkedIn: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(successResponse('Profile updated', { profile: user }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to update profile', error));
  }
};