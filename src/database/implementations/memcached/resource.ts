import { ConnectionExceptions } from "@core/exceptions";
import { AdaptersEnum } from "@database/enums";
import { IResource } from "@database/index";
import { DataSourceOptions } from "@database/types";
import Memcached from 'memcached';

export class MemcachedResource implements IResource<AdaptersEnum.MEMCACHED, Memcached> {
  public static _client: Memcached;
  public static logger?: (value: any) => void;
  public client?: Memcached;

  public async connect({ location, ...options }: DataSourceOptions<AdaptersEnum.MEMCACHED>): Promise<this> {
    if (MemcachedResource._client) {
      this.client = MemcachedResource._client;
      return this;
    }

    try {
      MemcachedResource._client = new Memcached(location, options);
      this.client = MemcachedResource._client;
      MemcachedResource.logger = options.logger;
      return this;
    } catch (err) {
      this.logger(err);
      throw new ConnectionExceptions('Failed to connect to Memcached');
    }
  }

  public disconnect(): void {
    if (MemcachedResource._client) {
      MemcachedResource._client.end();
    }
  }

  public validateConnection(): void {
    if (!MemcachedResource._client) {
      throw new ConnectionExceptions('MemcachedRepository not connected');
    }
  }

  public logger(value: any): void {
    if (MemcachedResource.logger) {
      MemcachedResource.logger(value);
    }
  }
}
