"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchJobs = exports.getJobById = exports.getJobs = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const apiResponse_1 = require("../utils/apiResponse");
const cacheService_1 = require("../services/cacheService");
const getJobs = async (req, res) => {
    try {
        // Try to get from cache first
        const cachedJobs = await (0, cacheService_1.getCachedJobsList)();
        if (cachedJobs) {
            return res.json((0, apiResponse_1.successResponse)('Jobs loaded from cache', { jobs: cachedJobs }));
        }
        const jobs = await client_1.default.job.findMany({ where: { status: 'ACTIVE' } });
        // Cache the results
        await (0, cacheService_1.cacheJobsList)(jobs);
        res.json((0, apiResponse_1.successResponse)('Jobs loaded', { jobs }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to load jobs', error));
    }
};
exports.getJobs = getJobs;
const getJobById = async (req, res) => {
    const { id } = req.params;
    try {
        // Try to get from cache first
        const cachedJob = await (0, cacheService_1.getCachedJobDetail)(id);
        if (cachedJob) {
            return res.json((0, apiResponse_1.successResponse)('Job loaded from cache', { job: cachedJob }));
        }
        const job = await client_1.default.job.findUnique({ where: { id } });
        if (!job) {
            return res.status(404).json((0, apiResponse_1.errorResponse)('Job not found'));
        }
        // Cache the result
        await (0, cacheService_1.cacheJobDetail)(id, job);
        res.json((0, apiResponse_1.successResponse)('Job loaded', { job }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to load job', error));
    }
};
exports.getJobById = getJobById;
const searchJobs = async (req, res) => {
    const { q, province, visaSponsored } = req.query;
    try {
        const jobs = await client_1.default.job.findMany({
            where: {
                status: 'ACTIVE',
                OR: q ? [
                    { title: { contains: String(q), mode: 'insensitive' } },
                    { company: { contains: String(q), mode: 'insensitive' } },
                    { description: { contains: String(q), mode: 'insensitive' } },
                ] : undefined,
                province: province ? String(province) : undefined,
                visaSponsored: visaSponsored ? String(visaSponsored).toLowerCase() === 'true' : undefined,
            },
        });
        res.json((0, apiResponse_1.successResponse)('Search results', { jobs }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Search failed', error));
    }
};
exports.searchJobs = searchJobs;
