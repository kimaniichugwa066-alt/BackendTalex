// Cache service - Redis removed, functions are no-ops
export const CACHE_KEYS = {
  JOBS_LIST: 'jobs:list',
  JOB_DETAIL: (id: string) => `jobs:detail:${id}`,
  DASHBOARD_STATS: 'admin:dashboard',
};

export const cacheJobsList = async (jobs: any[]) => {
  // No-op - Redis removed
};

export const getCachedJobsList = async () => {
  // No-op - Redis removed
  return null;
};

export const invalidateJobsCache = async () => {
  // No-op - Redis removed
};

export const cacheJobDetail = async (id: string, job: any) => {
  // No-op - Redis removed
};

export const getCachedJobDetail = async (id: string) => {
  // No-op - Redis removed
  return null;
};

export const invalidateJobDetailCache = async (id: string) => {
  // No-op - Redis removed
};

export const cacheDashboardStats = async (stats: any) => {
  // No-op - Redis removed
};

export const getCachedDashboardStats = async () => {
  // No-op - Redis removed
  return null;
};

export const invalidateDashboardCache = async () => {
  // No-op - Redis removed
};
