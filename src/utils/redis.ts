import { createClient } from 'redis';
import { config } from '../config';

const redisClient = createClient({
  url: config.redisUrl,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

export const connectRedis = async () => {
  await redisClient.connect();
};

export const getCache = async (key: string): Promise<string | null> => {
  try {
    return await redisClient.get(key);
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
};

export const setCache = async (key: string, value: string, ttlSeconds?: number): Promise<void> => {
  try {
    if (ttlSeconds) {
      await redisClient.setEx(key, ttlSeconds, value);
    } else {
      await redisClient.set(key, value);
    }
  } catch (error) {
    console.error('Redis set error:', error);
  }
};

export const deleteCache = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error('Redis delete error:', error);
  }
};

export default redisClient;
