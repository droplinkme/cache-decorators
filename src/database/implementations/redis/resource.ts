import { ConnectionExceptions } from "@core/exceptions";
import { AdaptersEnum } from "@database/enums";
import { IResource } from "@database/index";
import { DataSourceOptions } from "@database/types";
import { Redis } from "ioredis";

export class RedisResource implements IResource<AdaptersEnum.REDIS, Redis> {
  public static _client: Redis;
  public static logger?: (value: any) => void;
  public client?: Redis;

  public async connect(options: DataSourceOptions<AdaptersEnum.REDIS>): Promise<this> {
    if (RedisResource._client) {
      this.client = RedisResource._client;
      return this;
    }

    try {
      RedisResource._client = new Redis(options);
      this.client = RedisResource._client;
      RedisResource.logger = options.logger;
      return this;
    } catch (err) {
      this.logger(err);
      throw new ConnectionExceptions('Failed to connect to Redis');
    }
  }

  public disconnect(): void {
    if (RedisResource._client) {
      RedisResource._client.disconnect();
    }
  }

  public validateConnection(): void {
    if (!RedisResource._client || RedisResource._client.status !== 'ready') {
      throw new ConnectionExceptions('RedisCacheRepository not connected');
    }
  }

  public logger(value: any): void {
    if (RedisResource.logger) {
      RedisResource.logger(value);
    }
  }

  public async execute<T = any>(action: (...args: []) => Promise<T>): Promise<any> {
    try {
      this.validateConnection();
      return await action();
    } catch (err) {
      this.logger(err);
      throw err;
    }
  }
}