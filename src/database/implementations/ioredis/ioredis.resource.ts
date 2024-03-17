import { ConnectionExceptions } from "@core/exceptions";
import { AdaptersEnum } from "@database/enums";
import { IResource } from "@database/index";
import { DataSourceOptions } from "@database/types";
import { Redis } from "ioredis";

export class IORedisResource implements IResource<AdaptersEnum.REDIS, Redis> {
  public _client?: Redis;

  public async connect(config: DataSourceOptions<AdaptersEnum.REDIS>): Promise<this> {
    if (this._client) {
      return this;
    }

    try {
      this._client = new Redis({
        host: config.host,
        port: config.port ?? 6379,
        password: config.password,
        commandTimeout: config.timeout ?? 5000,
        retryStrategy: config.retryStrategy,
        reconnectOnError: config.reconnectOnError,
        maxRetriesPerRequest: config.maxRetries
      });

      return this
    } catch (err) {
      throw err;
    }
  }

  public disconnect(): void {
    if (this._client) {
      this._client.disconnect();
    }
  }

  public validateConnection(): void {
    if (!this._client || this._client.status !== 'ready') {
      throw new ConnectionExceptions('RedisCacheRepository not connected');
    }
  }
}