import { ConnectionExceptions } from "@core/exceptions";
import { IResource } from "@database/index";
import { IORedisAdapterOptions } from "@database/types";
import { Redis } from "ioredis";

export class IORedisResource extends IResource<'ioredis', Redis> {
  public static _client: Redis;

  protected async connect(config: IORedisAdapterOptions): Promise<void> {
    if (IORedisResource._client) {
      return;
    }

    try {
      IORedisResource._client = new Redis({
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

  protected disconnect(): void {
    if (IORedisResource._client) {
      IORedisResource._client.disconnect();
    }
  }

  public validateConnection(): void {
    if (IORedisResource._client.status !== 'ready') {
      throw new ConnectionExceptions('RedisCacheRepository not connected');
    }
  }
}