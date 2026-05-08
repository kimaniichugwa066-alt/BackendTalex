import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { successResponse, errorResponse } from '../utils/apiResponse';

export const generateReport = async (req: Request, res: Response) => {
  try {
    const { type, startDate, endDate } = req.body;

    let reportData;

    switch (type) {
      case 'applications':
        reportData = await generateApplicationsReport(startDate, endDate);
        break;
      case 'jobs':
        reportData = await generateJobsReport(startDate, endDate);
        break;
      case 'users':
        reportData = await generateUsersReport(startDate, endDate);
        break;
      case 'revenue':
        reportData = await generateRevenueReport(startDate, endDate);
        break;
      default:
        return res.status(400).json(errorResponse('Invalid report type'));
    }

    res.json(successResponse('Report generated successfully', reportData));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to generate report', error));
  }
};

const generateApplicationsReport = async (startDate?: string, endDate?: string) => {
  const whereClause: any = {};
  if (startDate && endDate) {
    whereClause.createdAt = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  const applications = await prisma.application.findMany({
    where: whereClause,
    include: {
      job: true,
      user: {
        select: { name: true, email: true },
      },
    },
  });

  return {
    type: 'applications',
    total: applications.length,
    data: applications,
  };
};

const generateJobsReport = async (startDate?: string, endDate?: string) => {
  const whereClause: any = {};
  if (startDate && endDate) {
    whereClause.createdAt = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  const jobs = await prisma.job.findMany({
    where: whereClause,
    include: {
      applications: true,
    },
  });

  return {
    type: 'jobs',
    total: jobs.length,
    data: jobs.map(job => ({
      ...job,
      applicationCount: job.applications.length,
    })),
  };
};

const generateUsersReport = async (startDate?: string, endDate?: string) => {
  const whereClause: any = {};
  if (startDate && endDate) {
    whereClause.createdAt = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  const users = await prisma.user.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isVerified: true,
      createdAt: true,
      applications: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  });

  return {
    type: 'users',
    total: users.length,
    data: users.map(user => ({
      ...user,
      applicationCount: user.applications.length,
    })),
  };
};

const generateRevenueReport = async (startDate?: string, endDate?: string) => {
  const whereClause: any = {};
  if (startDate && endDate) {
    whereClause.createdAt = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  const payments = await prisma.payment.findMany({
    where: whereClause,
  });

  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return {
    type: 'revenue',
    totalRevenue,
    totalPayments: payments.length,
    data: payments,
  };
};