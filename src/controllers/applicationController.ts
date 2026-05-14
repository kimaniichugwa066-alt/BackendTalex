import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { successResponse, errorResponse } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/authMiddleware';
import { sendApplicationSubmittedEmail, sendApplicationStatusUpdateEmail } from '../services/notificationService';
import { invalidateDashboardCache } from '../services/cacheService';

export const createApplication = async (req: AuthRequest, res: Response) => {
  const { jobId, paymentId, coverLetter } = req.body;
  const userId = req.user?.id;

  if (!coverLetter || coverLetter.trim().length < 20) {
    return res.status(400).json(errorResponse('Cover letter is required and must be at least 20 characters'));
  }

  try {
    const passportDocument = await prisma.document.findFirst({
      where: { userId: userId!, type: 'PASSPORT' },
    });

    if (!passportDocument) {
      return res.status(400).json(errorResponse('Passport document must be uploaded before applying'));
    }

    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment || payment.status !== 'SUCCESS') {
      return res.status(400).json(errorResponse('Payment must be completed before applying'));
    }
    if (payment.userId !== userId || payment.jobId !== jobId) {
      return res.status(403).json(errorResponse('Payment does not match application data'));
    }

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      const application = await tx.application.create({
        data: {
          trackingNumber: `TLX-${Date.now()}`,
          userId: userId!,
          jobId,
          status: 'APPLIED',
          paymentStatus: 'SUCCESS',
          paymentId,
        },
        include: { job: true, user: true },
      });

      // Create in-app notification
      await tx.notification.create({
        data: {
          userId: userId!,
          title: 'Application Submitted',
          message: `Your application for ${application.job.title} has been submitted successfully.`,
        },
      });

      return application;
    });

    // Send notification email asynchronously (outside transaction)
    sendApplicationSubmittedEmail(result.user.email, result.job.title, result.trackingNumber).catch(console.error);

    // Invalidate dashboard cache
    invalidateDashboardCache().catch(console.error);

    res.json(successResponse('Application submitted', { application: result, coverLetter, passportDocumentId: passportDocument.id }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to create application', error));
  }
};

export const getUserApplications = async (req: AuthRequest, res: Response) => {
  try {
    const applications = await prisma.application.findMany({
      where: { userId: req.user?.id },
      include: {
        job: {
          select: { id: true, title: true, company: true, province: true, salary: true, description: true }
        },
        user: {
          select: { id: true, name: true, email: true }
        }
      },
    });
    res.json(successResponse('User applications loaded', { applications }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to load applications', error));
  }
};

export const getApplicationById = async (req: AuthRequest, res: Response) => {
  try {
    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: {
        job: {
          select: { id: true, title: true, company: true, province: true, salary: true, description: true }
        },
        user: {
          select: { id: true, name: true, email: true }
        }
      },
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

export const getAllApplications = async (req: AuthRequest, res: Response) => {
  try {
    // Only admins can view all applications
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json(errorResponse('Only admins can view all applications'));
    }

    const applications = await prisma.application.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        job: {
          select: { id: true, title: true, company: true, province: true, salary: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(successResponse('All applications loaded', { applications }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to load applications', error));
  }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Only admins can update application status
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json(errorResponse('Only admins can update application status'));
    }

    if (!['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json(errorResponse('Invalid status. Must be one of: pending, reviewed, accepted, rejected'));
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: { user: true, job: true }
    });

    if (!application) {
      return res.status(404).json(errorResponse('Application not found'));
    }

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { id: true, name: true, email: true } },
        job: { select: { id: true, title: true, company: true } }
      }
    });

    // Send status update email asynchronously
    sendApplicationStatusUpdateEmail(application.user.email, application.job.title, status).catch(console.error);

    // Create in-app notification
    await prisma.notification.create({
      data: {
        userId: application.userId,
        title: `Application ${status}`,
        message: `Your application for ${application.job.title} has been ${status}.`,
      },
    });

    // Invalidate dashboard cache
    invalidateDashboardCache().catch(console.error);

    res.json(successResponse(`Application ${status}`, { application: updatedApplication }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to update application status', error));
  }
};
