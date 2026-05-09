import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { successResponse, errorResponse } from '../utils/apiResponse';
import { sendApplicationStatusUpdateEmail, sendEmail } from '../services/notificationService';
import { invalidateJobsCache, invalidateJobDetailCache, invalidateDashboardCache, cacheDashboardStats, getCachedDashboardStats } from '../services/cacheService';

export const createJob = async (req: Request, res: Response) => {
  try {
    const job = await prisma.job.create({ data: { ...req.body, deadline: new Date(req.body.deadline) } });

    // Invalidate jobs cache
    invalidateJobsCache().catch(console.error);

    res.json(successResponse('Job created', { job }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to create job', error));
  }
};

export const updateJob = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const job = await prisma.job.update({
      where: { id },
      data: { ...req.body, deadline: req.body.deadline ? new Date(req.body.deadline) : undefined },
    });

    // Invalidate caches
    invalidateJobsCache().catch(console.error);
    invalidateJobDetailCache(id).catch(console.error);

    res.json(successResponse('Job updated', { job }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to update job', error));
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.job.delete({ where: { id } });

    // Invalidate caches
    invalidateJobsCache().catch(console.error);
    invalidateJobDetailCache(id).catch(console.error);
    invalidateDashboardCache().catch(console.error);

    res.json(successResponse('Job deleted'));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to delete job', error));
  }
};

export const getAllApplications = async (_req: Request, res: Response) => {
  try {
    const applications = await prisma.application.findMany({ include: { user: true, job: true } });
    res.json(successResponse('Applications loaded', { applications }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to load applications', error));
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  const { applicationId, status } = req.body;
  try {
    const application = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
      include: { user: true, job: true },
    });

    // Send notification email asynchronously
    sendApplicationStatusUpdateEmail(application.user.email, application.job.title, status).catch(console.error);

    // Create in-app notification
    await prisma.notification.create({
      data: {
        userId: application.userId,
        title: 'Application Status Update',
        message: `Your application for ${application.job.title} has been ${status.toLowerCase()}.`,
      },
    });

    // Invalidate dashboard cache
    invalidateDashboardCache().catch(console.error);

    res.json(successResponse('Application status updated', { application }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to update application status', error));
  }
};

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, phone: true, role: true, isVerified: true, createdAt: true } });
    res.json(successResponse('Users loaded', { users }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to load users', error));
  }
};

export const getAllPayments = async (_req: Request, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({ include: { user: true, job: true } });
    res.json(successResponse('Payments loaded', { payments }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to load payments', error));
  }
};

export const getAllSupportRequests = async (_req: Request, res: Response) => {
  try {
    const supportRequests = await prisma.supportRequest.findMany({
      include: { user: { select: { id: true, name: true, email: true, phone: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(successResponse('Support requests loaded', { supportRequests }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to load support requests', error));
  }
};

export const replySupportRequest = async (req: Request, res: Response) => {
  const { requestId, reply } = req.body;
  try {
    const supportRequest = await prisma.supportRequest.update({
      where: { id: requestId },
      data: {
        reply,
        status: 'CLOSED',
        repliedAt: new Date(),
      },
      include: { user: true },
    });

    const html = `
      <h1>Support Request Response</h1>
      <p>Thank you for contacting Talex Support.</p>
      <p><strong>Your Issue:</strong> ${supportRequest.subject}</p>
      <p><strong>Our Response:</strong><br/>${reply}</p>
      <p>Best regards,<br>The Talex Team</p>
    `;

    sendEmail({
      to: supportRequest.user.email,
      subject: `Re: ${supportRequest.subject}`,
      html,
    }).catch(console.error);

    res.json(successResponse('Support request replied', { supportRequest }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to reply to support request', error));
  }
};

export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    // Try to get from cache first
    const cachedStats = await getCachedDashboardStats();
    if (cachedStats) {
      return res.json(successResponse('Dashboard stats loaded from cache', cachedStats));
    }

    const totalUsers = await prisma.user.count();
    const totalJobs = await prisma.job.count();
    const totalApplications = await prisma.application.count();
    const revenue = await prisma.payment.aggregate({ _sum: { amount: true } });

    const stats = {
      totalUsers,
      totalJobs,
      totalApplications,
      revenue: revenue._sum.amount || 0,
    };

    // Cache the stats
    await cacheDashboardStats(stats);

    res.json(successResponse('Dashboard stats loaded', stats));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to load dashboard', error));
  }
};
