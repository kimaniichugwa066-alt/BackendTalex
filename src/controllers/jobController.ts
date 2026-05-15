import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../prisma/client';
import { successResponse, errorResponse } from '../utils/apiResponse';
import { cacheJobsList, getCachedJobsList, cacheJobDetail, getCachedJobDetail } from '../services/cacheService';

export const getJobs = async (req: Request, res: Response) => {
  try {
    // Try to get from cache first
    const cachedJobs = await getCachedJobsList();
    if (cachedJobs) {
      return res.json(successResponse('Jobs loaded from cache', { jobs: cachedJobs }));
    }

    const jobs = await prisma.job.findMany({ where: { status: 'ACTIVE' } });

    // Cache the results
    await cacheJobsList(jobs);

    res.json(successResponse('Jobs loaded', { jobs }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to load jobs', error));
  }
};

export const getJobById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Try to get from cache first
    const cachedJob = await getCachedJobDetail(id);
    if (cachedJob) {
      return res.json(successResponse('Job loaded from cache', { job: cachedJob }));
    }

    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) {
      return res.status(404).json(errorResponse('Job not found'));
    }

    // Cache the result
    await cacheJobDetail(id, job);

    res.json(successResponse('Job loaded', { job }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to load job', error));
  }
};

export const searchJobs = async (req: Request, res: Response) => {
  const { q, province, visaSponsored } = req.query;
  try {
    let jobs;
    if (q) {
      // Use raw SQL for case-insensitive search in SQLite
      jobs = await prisma.$queryRaw`
        SELECT * FROM Job 
        WHERE status = 'ACTIVE' 
        AND (
          LOWER(title) LIKE LOWER(${`%${String(q)}%`}) 
          OR LOWER(company) LIKE LOWER(${`%${String(q)}%`}) 
          OR LOWER(description) LIKE LOWER(${`%${String(q)}%`})
        )
        ${province ? Prisma.sql`AND province = ${String(province)}` : Prisma.empty}
        ${visaSponsored ? Prisma.sql`AND visaSponsored = ${String(visaSponsored).toLowerCase() === 'true'}` : Prisma.empty}
      `;
    } else {
      jobs = await prisma.job.findMany({
        where: {
          status: 'ACTIVE',
          province: province ? String(province) : undefined,
          visaSponsored: visaSponsored ? String(visaSponsored).toLowerCase() === 'true' : undefined,
        },
      });
    }
    res.json(successResponse('Search results', { jobs }));
  } catch (error) {
    res.status(500).json(errorResponse('Search failed', error));
  }
};
