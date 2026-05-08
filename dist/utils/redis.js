"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCache = exports.setCache = exports.getCache = exports.connectRedis = void 0;
const redis_1 = require("redis");
const config_1 = require("../config");
const redisClient = (0, redis_1.createClient)({
    url: config_1.config.redisUrl,
});
redisClient.on('error', (err) => console.log('Redis Client Error', err));
const connectRedis = async () => {
    await redisClient.connect();
};
exports.connectRedis = connectRedis;
const getCache = async (key) => {
    try {
        return await redisClient.get(key);
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
            await redisClient.setEx(key, ttlSeconds, value);
        }
        else {
            await redisClient.set(key, value);
        }
    }
    catch (error) {
        console.error('Redis set error:', error);
    }
};
exports.setCache = setCache;
const deleteCache = async (key) => {
    try {
        await redisClient.del(key);
    }
    catch (error) {
        console.error('Redis delete error:', error);
    }
};
exports.deleteCache = deleteCache;
exports.default = redisClient;
