import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { successResponse, errorResponse } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/authMiddleware';
import { sendApplicationSubmittedEmail, sendApplicationStatusUpdateEmail } from '../services/notificationService';
import { invalidateDashboardCache } from '../services/cacheService';

export const createApplication = async (req: AuthRequest, res: Response) => {
  const { jobId, paymentId } = req.body;
  const userId = req.user?.id;

  try {
    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment || payment.status !== 'SUCCESS') {
      return res.status(400).json(errorResponse('Payment must be completed before applying'));
    }
    if (payment.userId !== userId || payment.jobId !== jobId) {
      return res.status(403).json(errorResponse('Payment does not match application data'));
    }

    const application = await prisma.application.create({
      data: {
        trackingNumber: `TLX-${Date.now()}`,
        userId: userId!,
        jobId,
        status: 'SUBMITTED',
        paymentStatus: 'SUCCESS',
        paymentId,
      },
      include: { job: true, user: true },
    });

    // Send notification email asynchronously
    sendApplicationSubmittedEmail(application.user.email, application.job.title, application.trackingNumber).catch(console.error);

    // Create in-app notification
    await prisma.notification.create({
      data: {
        userId: userId!,
        title: 'Application Submitted',
        message: `Your application for ${application.job.title} has been submitted successfully.`,
      },
    });

    // Invalidate dashboard cache
    invalidateDashboardCache().catch(console.error);

    res.json(successResponse('Application submitted', { application }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to create application', error));
  }
};

export const getUserApplications = async (req: AuthRequest, res: Response) => {
  try {
    const applications = await prisma.application.findMany({
      where: { userId: req.user?.id },
      include: { job: true },
    });
    res.json(successResponse('User applications loaded', { applications }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to load applications', error));
  }
};

export const getApplicationById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const application = await prisma.application.findUnique({
      where: { id },
      include: { job: true },
    });
    if (!application) {
      return res.status(404).json(errorResponse('Application not found'));
    }
    if (application.userId !== req.user?.id && req.user?.role !== 'ADMIN') {
      return res.status(403).json(errorResponse('Access denied'));
    }
    res.json(successResponse('Application loaded', { application }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to load application', error));
  }
};
