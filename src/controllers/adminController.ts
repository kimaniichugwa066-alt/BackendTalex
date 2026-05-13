import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
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
    const applications = await prisma.application.findMany({
      include: { user: true, job: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(successResponse('Applications loaded', { applications }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to load applications', error));
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  const { applicationId, status } = req.body;
  try {
    // Use transaction to ensure data consistency
    const application = await prisma.$transaction(async (tx) => {
      const updatedApplication = await tx.application.update({
        where: { id: applicationId },
        data: { status },
        include: { user: true, job: true },
      });

      // Create in-app notification
      await tx.notification.create({
        data: {
          userId: updatedApplication.userId,
          title: 'Application Status Update',
          message: `Your application for ${updatedApplication.job.title} has been ${status.toLowerCase()}.`,
        },
      });

      return updatedApplication;
    });

    // Send notification email asynchronously (outside transaction)
    sendApplicationStatusUpdateEmail(application.user.email, application.job.title, status).catch(console.error);

    // Invalidate dashboard cache
    invalidateDashboardCache().catch(console.error);

    res.json(successResponse('Application status updated', { application }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to update application status', error));
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        isBanned: true,
        headline: true,
        location: true,
        summary: true,
        experience: true,
        education: true,
        linkedIn: true,
        createdAt: true,
        updatedAt: true,
        documents: {
          select: {
            id: true,
            type: true,
            url: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        applications: {
          select: {
            id: true,
            trackingNumber: true,
            status: true,
            paymentStatus: true,
            createdAt: true,
            job: {
              select: {
                id: true,
                title: true,
                company: true,
                province: true,
                salary: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            mpesaCode: true,
            phone: true,
            createdAt: true,
            job: {
              select: {
                id: true,
                title: true,
                company: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        notifications: {
          select: {
            id: true,
            title: true,
            message: true,
            isRead: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10, // Last 10 notifications
        },
        supportRequests: {
          select: {
            id: true,
            category: true,
            subject: true,
            message: true,
            status: true,
            reply: true,
            createdAt: true,
            repliedAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return res.status(404).json(errorResponse('User not found'));
    }

    res.json(successResponse('User details loaded', { user }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to load user details', error));
  }
};

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        isBanned: true,
        headline: true,
        location: true,
        summary: true,
        experience: true,
        education: true,
        linkedIn: true,
        createdAt: true,
        updatedAt: true,
        documents: {
          select: {
            id: true,
            type: true,
            url: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        applications: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            job: {
              select: {
                id: true,
                title: true,
                company: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            createdAt: true,
            job: {
              select: {
                id: true,
                title: true,
                company: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(successResponse('Users loaded', { users }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to load users', error));
  }
};

export const banUser = async (req: Request, res: Response) => {
  const { ban } = req.body;
  const { id } = req.params;
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { isBanned: ban },
    });
    res.json(successResponse('User ban status updated', { user: { id: user.id, email: user.email, isBanned: user.isBanned } }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to update user ban status', error));
  }
};

export const resetUserPassword = async (req: Request, res: Response) => {
  const { newPassword } = req.body;
  const { id } = req.params;
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await prisma.user.update({
      where: { id },
      data: { password: hashedPassword, resetToken: null },
    });

    sendEmail({
      to: user.email,
      subject: 'Your password was reset by admin',
      html: `<p>Your password has been successfully reset by an administrator. If you did not request this, please contact support.</p>`,
    }).catch(console.error);

    res.json(successResponse('User password reset successfully', { user: { id: user.id, email: user.email } }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to reset user password', error));
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, phone, headline, location, summary, experience, education, linkedIn } = req.body;

  try {
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (headline !== undefined) updateData.headline = headline;
    if (location !== undefined) updateData.location = location;
    if (summary !== undefined) updateData.summary = summary;
    if (experience !== undefined) updateData.experience = experience;
    if (education !== undefined) updateData.education = education;
    if (linkedIn !== undefined) updateData.linkedIn = linkedIn;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
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
        isBanned: true,
      },
    });

    res.json(successResponse('User updated successfully', { user }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to update user', error));
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
