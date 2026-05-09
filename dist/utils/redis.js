"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = exports.deleteCache = exports.setCache = exports.getCache = void 0;
const axios_1 = __importDefault(require("axios"));
const redis_1 = require("redis");
const redisUrl = process.env.REDIS_URL?.trim() || '';
const upstashRestUrl = process.env.UPSTASH_REDIS_REST_URL?.trim().replace(/\/+$|\s+$/g, '') || '';
const upstashRestToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim() || '';
const useUpstashRest = Boolean(upstashRestUrl && upstashRestToken);
let redis = null;
const redisOptions = {
    url: redisUrl,
};
const shouldUseTls = redisUrl.startsWith('rediss://') ||
    redisUrl.includes('upstash.io') ||
    process.env.REDIS_TLS === 'true';
if (redisUrl && shouldUseTls) {
    redisOptions.socket = {
        tls: true,
        rejectUnauthorized: false,
    };
}
if (!useUpstashRest && redisUrl) {
    redis = (0, redis_1.createClient)(redisOptions);
    redis?.on('error', (err) => {
        console.error('Redis Client Error', err);
    });
}
const upstashRequest = async (method, path, data) => {
    const url = `${upstashRestUrl}/${path}`;
    const response = await (0, axios_1.default)({
        method,
        url,
        headers: {
            Authorization: `Bearer ${upstashRestToken}`,
            'Content-Type': 'application/json',
        },
        data,
    });
    return response.data;
};
const upstashGet = async (key) => {
    const result = await upstashRequest('get', `get/${encodeURIComponent(key)}`);
    if (result == null)
        return null;
    if (typeof result === 'object' && result !== null && 'result' in result) {
        return result.result ?? null;
    }
    return typeof result === 'string' ? result : null;
};
const upstashSet = async (key, value, ttlSeconds) => {
    await upstashRequest('post', `set/${encodeURIComponent(key)}`, { value });
    if (ttlSeconds) {
        await upstashRequest('post', `expire/${encodeURIComponent(key)}/${ttlSeconds}`);
    }
};
const upstashDel = async (key) => {
    await upstashRequest('post', `del/${encodeURIComponent(key)}`);
};
const useRedisClient = () => {
    if (!redis) {
        throw new Error('Redis client is not initialized. Check REDIS_URL or Upstash REST configuration.');
    }
    return redis;
};
const getCache = async (key) => {
    try {
        if (useUpstashRest) {
            return await upstashGet(key);
        }
        return await useRedisClient().get(key);
    }
    catch (error) {
        console.error('Redis get error:', error);
        return null;
    }
};
exports.getCache = getCache;
const setCache = async (key, value, ttlSeconds) => {
    try {
        if (useUpstashRest) {
            await upstashSet(key, value, ttlSeconds);
            return;
        }
        const client = useRedisClient();
        if (ttlSeconds) {
            await client.setEx(key, ttlSeconds, value);
        }
        else {
            await client.set(key, value);
        }
    }
    catch (error) {
        console.error('Redis set error:', error);
    }
};
exports.setCache = setCache;
const deleteCache = async (key) => {
    try {
        if (useUpstashRest) {
            await upstashDel(key);
            return;
        }
        await useRedisClient().del(key);
    }
    catch (error) {
        console.error('Redis delete error:', error);
    }
};
exports.deleteCache = deleteCache;
const connectRedis = async () => {
    if (useUpstashRest) {
        console.log('Using Upstash REST Redis client');
        return;
    }
    if (!redis) {
        console.warn('Redis is not configured. Skipping Redis connection.');
        return;
    }
    try {
        if (!redis.isOpen) {
            await redis.connect();
        }
        console.log('Redis client connected successfully');
    }
    catch (error) {
        console.warn('Redis connection failed during initialization:', error instanceof Error ? error.message : String(error));
    }
};
exports.connectRedis = connectRedis;
exports.default = redis;
