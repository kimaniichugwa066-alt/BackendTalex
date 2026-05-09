import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { successResponse, errorResponse } from '../utils/apiResponse';
import {
  sendApplicationStatusUpdateEmail,
  sendInterviewScheduledEmail,
  sendOfferEmail,
  sendHiredEmail,
  sendRejectedEmail,
} from '../services/notificationService';

const createNotification = async (userId: string, title: string, message: string) => {
  await prisma.notification.create({
    data: {
      userId,
      title,
      message,
    },
  });
};

export const reviewApplication = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const application = await prisma.application.findUnique({
      where: { id },
      include: { user: true, job: true },
    });

    if (!application) {
      return res.status(404).json(errorResponse('Application not found'));
    }

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { status: 'UNDER_REVIEW' },
      include: { user: true, job: true },
    });

    await sendApplicationStatusUpdateEmail(updatedApplication.user.email, updatedApplication.job.title, 'UNDER_REVIEW').catch(console.error);
    await createNotification(
      updatedApplication.userId,
      'Application Under Review',
      `Your application for ${updatedApplication.job.title} is now under review.`
    );

    res.json(successResponse('Application moved to under review', { application: updatedApplication }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to update application status', error));
  }
};

export const scheduleInterview = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { date, link } = req.body;

  try {
    const application = await prisma.application.findUnique({
      where: { id },
      include: { user: true, job: true },
    });

    if (!application) {
      return res.status(404).json(errorResponse('Application not found'));
    }

    const interviewDate = new Date(date);

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        status: 'INTERVIEW_SCHEDULED',
        interviewDate,
        interviewLink: link,
      },
      include: { user: true, job: true },
    });

    await sendInterviewScheduledEmail(updatedApplication.user.email, updatedApplication.job.title, interviewDate.toISOString(), link).catch(console.error);
    await createNotification(
      updatedApplication.userId,
      'Interview Scheduled',
      `Your interview for ${updatedApplication.job.title} is scheduled for ${interviewDate.toISOString()}.`
    );

    res.json(successResponse('Interview scheduled', { application: updatedApplication }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to schedule interview', error));
  }
};

export const sendOffer = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const application = await prisma.application.findUnique({
      where: { id },
      include: { user: true, job: true },
    });

    if (!application) {
      return res.status(404).json(errorResponse('Application not found'));
    }

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { status: 'OFFER_SENT' },
      include: { user: true, job: true },
    });

    await sendOfferEmail(updatedApplication.user.email, updatedApplication.job.title).catch(console.error);
    await createNotification(
      updatedApplication.userId,
      'Offer Sent',
      `An offer has been sent for your application to ${updatedApplication.job.title}.`
    );

    res.json(successResponse('Offer sent', { application: updatedApplication }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to send offer', error));
  }
};

export const markHired = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const application = await prisma.application.findUnique({
      where: { id },
      include: { user: true, job: true },
    });

    if (!application) {
      return res.status(404).json(errorResponse('Application not found'));
    }

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { status: 'HIRED' },
      include: { user: true, job: true },
    });

    await sendHiredEmail(updatedApplication.user.email, updatedApplication.job.title).catch(console.error);
    await createNotification(
      updatedApplication.userId,
      'Hired',
      `Congratulations! You have been hired for ${updatedApplication.job.title}.`
    );

    res.json(successResponse('Applicant marked as hired', { application: updatedApplication }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to mark applicant as hired', error));
  }
};

export const rejectApplication = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const application = await prisma.application.findUnique({
      where: { id },
      include: { user: true, job: true },
    });

    if (!application) {
      return res.status(404).json(errorResponse('Application not found'));
    }

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { status: 'REJECTED' },
      include: { user: true, job: true },
    });

    await sendRejectedEmail(updatedApplication.user.email, updatedApplication.job.title).catch(console.error);
    await createNotification(
      updatedApplication.userId,
      'Application Rejected',
      `Your application for ${updatedApplication.job.title} has been rejected.`
    );

    res.json(successResponse('Application rejected', { application: updatedApplication }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to reject application', error));
  }
};
