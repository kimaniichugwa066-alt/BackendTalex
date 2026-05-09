import { Response } from 'express';
import prisma from '../prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';
import { successResponse, errorResponse } from '../utils/apiResponse';
import { config } from '../config';
import { sendEmail } from '../services/notificationService';

const supportEmail = config.supportEmail || config.brevo.senderEmail || config.email.user;

export const createSupportRequest = async (req: AuthRequest, res: Response) => {
  const { category, subject, message } = req.body;
  try {
    const supportRequest = await prisma.supportRequest.create({
      data: {
        userId: req.user?.id!,
        category,
        subject,
        message,
      },
    });

    const html = `
      <h1>Support Request</h1>
      <p><strong>User:</strong> ${req.user?.id}</p>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `;

    sendEmail({
      to: supportEmail,
      subject: `Support Request: ${subject}`,
      html,
    }).catch(console.error);

    res.json(successResponse('Support request submitted', { supportRequest }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to submit support request', error));
  }
};

export const getUserSupportRequests = async (req: AuthRequest, res: Response) => {
  try {
    const requests = await prisma.supportRequest.findMany({
      where: { userId: req.user?.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(successResponse('Support requests loaded', { requests }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to load support requests', error));
  }
};