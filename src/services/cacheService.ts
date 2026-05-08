import { getCache, setCache, deleteCache } from '../utils/redis';

export const CACHE_KEYS = {
  JOBS_LIST: 'jobs:list',
  JOB_DETAIL: (id: string) => `jobs:detail:${id}`,
  DASHBOARD_STATS: 'admin:dashboard',
};

export const cacheJobsList = async (jobs: any[]) => {
  await setCache(CACHE_KEYS.JOBS_LIST, JSON.stringify(jobs), 300); // 5 minutes
};

export const getCachedJobsList = async () => {
  const cached = await getCache(CACHE_KEYS.JOBS_LIST);
  return cached ? JSON.parse(cached) : null;
};

export const invalidateJobsCache = async () => {
  await deleteCache(CACHE_KEYS.JOBS_LIST);
};

export const cacheJobDetail = async (id: string, job: any) => {
  await setCache(CACHE_KEYS.JOB_DETAIL(id), JSON.stringify(job), 600); // 10 minutes
};

export const getCachedJobDetail = async (id: string) => {
  const cached = await getCache(CACHE_KEYS.JOB_DETAIL(id));
  return cached ? JSON.parse(cached) : null;
};

export const invalidateJobDetailCache = async (id: string) => {
  await deleteCache(CACHE_KEYS.JOB_DETAIL(id));
};

export const cacheDashboardStats = async (stats: any) => {
  await setCache(CACHE_KEYS.DASHBOARD_STATS, JSON.stringify(stats), 300); // 5 minutes
};

export const getCachedDashboardStats = async () => {
  const cached = await getCache(CACHE_KEYS.DASHBOARD_STATS);
  return cached ? JSON.parse(cached) : null;
};

export const invalidateDashboardCache = async () => {
  await deleteCache(CACHE_KEYS.DASHBOARD_STATS);
};
