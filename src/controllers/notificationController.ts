import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { successResponse, errorResponse } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/authMiddleware';

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user?.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(successResponse('Notifications loaded', { notifications }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to load notifications', error));
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification || notification.userId !== req.user?.id) {
      return res.status(404).json(errorResponse('Notification not found'));
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
    res.json(successResponse('Notification marked read', { notification: updated }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to mark as read', error));
  }
};
