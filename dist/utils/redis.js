"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = exports.deleteCache = exports.setCache = exports.getCache = void 0;
const redis_1 = require("redis");
const redis = (0, redis_1.createClient)({
    url: process.env.REDIS_URL,
});
redis.on('error', (err) => {
    console.error('Redis Client Error', err);
});
(async () => {
    await redis.connect();
})();
const getCache = async (key) => {
    try {
        return await redis.get(key);
    }
    catch (error) {
        console.error('Redis get error:', error);
        return null;
    }
};
exports.getCache = getCache;
const setCache = async (key, value, ttlSeconds) => {
    try {
        if (ttlSeconds) {
            await redis.setEx(key, ttlSeconds, value);
        }
        else {
            await redis.set(key, value);
        }
    }
    catch (error) {
        console.error('Redis set error:', error);
    }
};
exports.setCache = setCache;
const deleteCache = async (key) => {
    try {
        await redis.del(key);
    }
    catch (error) {
        console.error('Redis delete error:', error);
    }
};
exports.deleteCache = deleteCache;
const connectRedis = async () => {
    // Redis is already connected via IIFE above
    console.log('Using pre-connected Redis client');
};
exports.connectRedis = connectRedis;
exports.default = redis;
