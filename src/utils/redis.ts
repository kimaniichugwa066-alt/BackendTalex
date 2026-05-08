import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on('error', (err) => {
  console.error('Redis Client Error', err);
});

(async () => {
  await redis.connect();
})();

export const getCache = async (key: string): Promise<string | null> => {
  try {
    return await redis.get(key);
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
};

export const setCache = async (key: string, value: string, ttlSeconds?: number): Promise<void> => {
  try {
    if (ttlSeconds) {
      await redis.setEx(key, ttlSeconds, value);
    } else {
      await redis.set(key, value);
    }
  } catch (error) {
    console.error('Redis set error:', error);
  }
};

export const deleteCache = async (key: string): Promise<void> => {
  try {
    await redis.del(key);
  } catch (error) {
    console.error('Redis delete error:', error);
  }
};

export const connectRedis = async () => {
  // Redis is already connected via IIFE above
  console.log('Using pre-connected Redis client');
};

export default redis;
