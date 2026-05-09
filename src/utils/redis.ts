import axios from 'axios';
import { createClient, RedisClientType, RedisClientOptions } from 'redis';

const redisUrl = process.env.REDIS_URL?.trim() || '';
const upstashRestUrl = process.env.UPSTASH_REDIS_REST_URL?.trim().replace(/\/+$|\s+$/g, '') || '';
const upstashRestToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim() || '';
const useUpstashRest = Boolean(upstashRestUrl && upstashRestToken);
let redis: RedisClientType | null = null;

const redisOptions: RedisClientOptions = {
  url: redisUrl,
};

const shouldUseTls =
  redisUrl.startsWith('rediss://') ||
  redisUrl.includes('upstash.io') ||
  process.env.REDIS_TLS === 'true';

if (redisUrl && shouldUseTls) {
  redisOptions.socket = {
    tls: true,
    rejectUnauthorized: false,
    family: 4,
  };
}

if (!useUpstashRest && redisUrl) {
  redis = createClient(redisOptions);

  redis.on('error', (err) => {
    console.error('Redis Client Error', err);
  });
}

const upstashRequest = async (method: 'get' | 'post', path: string, data?: unknown) => {
  const url = `${upstashRestUrl}/${path}`;
  const response = await axios({
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

const upstashGet = async (key: string): Promise<string | null> => {
  const result = await upstashRequest('get', `get/${encodeURIComponent(key)}`);
  if (result == null) return null;
  if (typeof result === 'object' && result !== null && 'result' in result) {
    return result.result ?? null;
  }
  return typeof result === 'string' ? result : null;
};

const upstashSet = async (key: string, value: string, ttlSeconds?: number): Promise<void> => {
  await upstashRequest('post', `set/${encodeURIComponent(key)}`, { value });
  if (ttlSeconds) {
    await upstashRequest('post', `expire/${encodeURIComponent(key)}/${ttlSeconds}`);
  }
};

const upstashDel = async (key: string): Promise<void> => {
  await upstashRequest('post', `del/${encodeURIComponent(key)}`);
};

const useRedisClient = () => {
  if (!redis) {
    throw new Error('Redis client is not initialized. Check REDIS_URL or Upstash REST configuration.');
  }
  return redis;
};

export const getCache = async (key: string): Promise<string | null> => {
  try {
    if (useUpstashRest) {
      return await upstashGet(key);
    }
    return await useRedisClient().get(key);
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
};

export const setCache = async (key: string, value: string, ttlSeconds?: number): Promise<void> => {
  try {
    if (useUpstashRest) {
      await upstashSet(key, value, ttlSeconds);
      return;
    }
    const client = useRedisClient();
    if (ttlSeconds) {
      await client.setEx(key, ttlSeconds, value);
    } else {
      await client.set(key, value);
    }
  } catch (error) {
    console.error('Redis set error:', error);
  }
};

export const deleteCache = async (key: string): Promise<void> => {
  try {
    if (useUpstashRest) {
      await upstashDel(key);
      return;
    }
    await useRedisClient().del(key);
  } catch (error) {
    console.error('Redis delete error:', error);
  }
};

export const connectRedis = async () => {
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
  } catch (error) {
    console.warn('Redis connection failed during initialization:', error instanceof Error ? error.message : String(error));
  }
};

export default redis;
