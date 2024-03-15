import { ICacheRepository } from '../interfaces';
import { createHash } from 'crypto';
import Redis from 'ioredis';
import { ConnectionExceptions } from '@core/exceptions';
import { DataSourceOptions } from '@core/types';
export class IORedisCacheRepository implements ICacheRepository {
  private static _client: Redis;

  public static async connect(config: DataSourceOptions): Promise<void> {
    if (IORedisCacheRepository._client) {
      return;
    }

    try {
      IORedisCacheRepository._client = new Redis({
        host: config.host,
        port: config.port ?? 6379,
        password: config.password,
        commandTimeout: config.timeout ?? 5000,
        retryStrategy: config.retryStrategy,
        reconnectOnError: config.reconnectOnError,
        maxRetriesPerRequest: config.maxRetries
      });
    } catch (err) {
      throw err;
    }
  }

  public static disconnect(): void {
    if (IORedisCacheRepository._client) {
      IORedisCacheRepository._client.disconnect();
    }
  }

  public async save<T = any>(key: string, value: T, ttl?: number): Promise<T> {
    try {
      IORedisCacheRepository.validateConnection();

      const valueStr = JSON.stringify(value);
      ttl
        ? await IORedisCacheRepository._client.set(key, valueStr, 'EX', ttl)
        : await IORedisCacheRepository._client.set(key, valueStr);
    } catch (err) {
      throw err;
    }

    return value;
  }

  public async getValuesByPattern<T = any>(pattern: string): Promise<T[]> {
    try {
      IORedisCacheRepository.validateConnection();

      const stream = IORedisCacheRepository._client.scanStream({
        match: pattern,
        count: 10
      });

      const result: T[] = await new Promise((resolve, reject) => {
        const keys = new Set<string>();

        stream.on('data', (data) => {
          data.forEach(keys.add, keys);
        });

        stream.on('error', (err) => {
          reject(err);
        });

        stream.on('end', async () => {
          if (keys.size === 0) {
            resolve([]);
          }
          const values: T[] = await Promise.all<T>(
            [...keys].map(async (key) => {
              const result = await IORedisCacheRepository._client.get(key);
              if (result) {
                return JSON.parse(result);
              }
            })
          );

          resolve(values);
        });
      });

      return result;
    } catch (err) {
      throw err;
    }
  }

  public async remove(key: string): Promise<void> {
    try {
      IORedisCacheRepository.validateConnection();

      await IORedisCacheRepository._client.del(key);
    } catch (err) {
      throw err;
    }
  }

  public async removeByPrefix(prefix: string): Promise<void> {
    try {
      IORedisCacheRepository.validateConnection();

      const pipeline = IORedisCacheRepository._client.pipeline();

      await IORedisCacheRepository._client
        .keys(`${prefix}*`)
        .then((keys) => { keys.forEach((key) => pipeline.del(key)); });

      await pipeline.exec();
    } catch (err) {
      throw err;
    }
  }

  public async recover<T = any>(key: string): Promise<T | undefined> {
    try {
      IORedisCacheRepository.validateConnection();
      const valueStr = await IORedisCacheRepository._client.get(key);
      if (valueStr) return JSON.parse(valueStr);
    } catch (err) {
      throw err;
    }
  }

  public async invalidate(key: string): Promise<void> {
    try {
      IORedisCacheRepository.validateConnection();
      await IORedisCacheRepository._client.expire(key, 1);
    } catch (err) {
      throw err;
    }
  }

  public async flushAll(): Promise<void> {
    try {
      IORedisCacheRepository.validateConnection();
      await IORedisCacheRepository._client.flushall();
    } catch (err) {
      throw err;
    }
  }

  private static validateConnection(): void {
    if (IORedisCacheRepository._client.status !== 'ready') {
      throw new ConnectionExceptions('RedisCacheRepository not connected');
    }
  }

  public createHashedKey(hashable: any, prefix?: string): string {
    const hash = createHash('md5')
      .update(JSON.stringify(hashable))
      .digest('hex');

    return `${prefix ?? ''}${hash}`;
  }

  public async recoverOrSave<T = any>(
    key: string,
    fn: () => Promise<T>,
    ttl?: number,
    no_cache?: boolean
  ): Promise<T | undefined> {
    if (!no_cache) {
      const cachedValue = await this.recover(key);
      if (cachedValue) return cachedValue;
    }

    try {
      const value = await fn();
      return await this.save(key, value, ttl);
    } catch (error: any) {
      throw error;
    }
  }
}
