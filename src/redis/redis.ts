import { Redis } from '@upstash/redis';
import config from '../config';

export interface RedisClient {
  get: (key: string) => Promise<string | null>;
  set: (
    key: string,
    value: string | number | boolean | object,
    options?: { ex?: number },
  ) => Promise<string>;
  keys: (pattern: string) => Promise<string[]>;
  del: (...keys: string[]) => Promise<number>;
  ping: () => Promise<string>;
  quit?: () => Promise<void>;
}

let redis: RedisClient;

if (config.isTest) {
  // Mock Redis for tests
  redis = {
    get: async () => null,
    set: async () => 'OK',
    keys: async () => [],
    del: async () => 0,
    ping: async () => 'PONG',
  };
} else {
  const redisClient = new Redis({
    url: config.redis.url,
    token: config.redis.token,
  });

  redis = {
    get: async (key: string) => {
      const result = await redisClient.get(key);
      return result ? JSON.stringify(result) : null;
    },
    set: async (
      key: string,
      value: string | number | boolean | object,
      options?: { ex?: number },
    ) => {
      const serialized =
        typeof value === 'string' ? value : JSON.stringify(value);
      if (options?.ex) {
        const result = await redisClient.set(key, serialized, {
          ex: options.ex,
        });
        return result || 'OK';
      }
      const result = await redisClient.set(key, serialized);
      return result || 'OK';
    },
    keys: async (pattern: string) => {
      // Upstash Redis doesn't support KEYS command directly
      // In production, use SCAN or maintain a set of keys
      return [];
    },
    del: async (...keys: string[]) => {
      return await redisClient.del(...keys);
    },
    ping: async () => {
      const result = await redisClient.ping();
      return result === 'PONG' ? 'PONG' : 'FAILED';
    },
  };
}

export default redis;
