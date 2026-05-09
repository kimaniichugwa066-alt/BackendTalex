"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidateDashboardCache = exports.getCachedDashboardStats = exports.cacheDashboardStats = exports.invalidateJobDetailCache = exports.getCachedJobDetail = exports.cacheJobDetail = exports.invalidateJobsCache = exports.getCachedJobsList = exports.cacheJobsList = exports.CACHE_KEYS = void 0;
// Cache service - Redis removed, functions are no-ops
exports.CACHE_KEYS = {
    JOBS_LIST: 'jobs:list',
    JOB_DETAIL: (id) => `jobs:detail:${id}`,
    DASHBOARD_STATS: 'admin:dashboard',
};
const cacheJobsList = async (jobs) => {
    // No-op - Redis removed
};
exports.cacheJobsList = cacheJobsList;
const getCachedJobsList = async () => {
    // No-op - Redis removed
    return null;
};
exports.getCachedJobsList = getCachedJobsList;
const invalidateJobsCache = async () => {
    // No-op - Redis removed
};
exports.invalidateJobsCache = invalidateJobsCache;
const cacheJobDetail = async (id, job) => {
    // No-op - Redis removed
};
exports.cacheJobDetail = cacheJobDetail;
const getCachedJobDetail = async (id) => {
    // No-op - Redis removed
    return null;
};
exports.getCachedJobDetail = getCachedJobDetail;
const invalidateJobDetailCache = async (id) => {
    // No-op - Redis removed
};
exports.invalidateJobDetailCache = invalidateJobDetailCache;
const cacheDashboardStats = async (stats) => {
    // No-op - Redis removed
};
exports.cacheDashboardStats = cacheDashboardStats;
const getCachedDashboardStats = async () => {
    // No-op - Redis removed
    return null;
};
exports.getCachedDashboardStats = getCachedDashboardStats;
const invalidateDashboardCache = async () => {
    // No-op - Redis removed
};
exports.invalidateDashboardCache = invalidateDashboardCache;
