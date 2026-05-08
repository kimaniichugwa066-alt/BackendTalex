"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidateDashboardCache = exports.getCachedDashboardStats = exports.cacheDashboardStats = exports.invalidateJobDetailCache = exports.getCachedJobDetail = exports.cacheJobDetail = exports.invalidateJobsCache = exports.getCachedJobsList = exports.cacheJobsList = exports.CACHE_KEYS = void 0;
const redis_1 = require("../utils/redis");
exports.CACHE_KEYS = {
    JOBS_LIST: 'jobs:list',
    JOB_DETAIL: (id) => `jobs:detail:${id}`,
    DASHBOARD_STATS: 'admin:dashboard',
};
const cacheJobsList = async (jobs) => {
    await (0, redis_1.setCache)(exports.CACHE_KEYS.JOBS_LIST, JSON.stringify(jobs), 300); // 5 minutes
};
exports.cacheJobsList = cacheJobsList;
const getCachedJobsList = async () => {
    const cached = await (0, redis_1.getCache)(exports.CACHE_KEYS.JOBS_LIST);
    return cached ? JSON.parse(cached) : null;
};
exports.getCachedJobsList = getCachedJobsList;
const invalidateJobsCache = async () => {
    await (0, redis_1.deleteCache)(exports.CACHE_KEYS.JOBS_LIST);
};
exports.invalidateJobsCache = invalidateJobsCache;
const cacheJobDetail = async (id, job) => {
    await (0, redis_1.setCache)(exports.CACHE_KEYS.JOB_DETAIL(id), JSON.stringify(job), 600); // 10 minutes
};
exports.cacheJobDetail = cacheJobDetail;
const getCachedJobDetail = async (id) => {
    const cached = await (0, redis_1.getCache)(exports.CACHE_KEYS.JOB_DETAIL(id));
    return cached ? JSON.parse(cached) : null;
};
exports.getCachedJobDetail = getCachedJobDetail;
const invalidateJobDetailCache = async (id) => {
    await (0, redis_1.deleteCache)(exports.CACHE_KEYS.JOB_DETAIL(id));
};
exports.invalidateJobDetailCache = invalidateJobDetailCache;
const cacheDashboardStats = async (stats) => {
    await (0, redis_1.setCache)(exports.CACHE_KEYS.DASHBOARD_STATS, JSON.stringify(stats), 300); // 5 minutes
};
exports.cacheDashboardStats = cacheDashboardStats;
const getCachedDashboardStats = async () => {
    const cached = await (0, redis_1.getCache)(exports.CACHE_KEYS.DASHBOARD_STATS);
    return cached ? JSON.parse(cached) : null;
};
exports.getCachedDashboardStats = getCachedDashboardStats;
const invalidateDashboardCache = async () => {
    await (0, redis_1.deleteCache)(exports.CACHE_KEYS.DASHBOARD_STATS);
};
exports.invalidateDashboardCache = invalidateDashboardCache;
