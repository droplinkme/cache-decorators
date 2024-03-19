
import { RedisCacheRepository } from "@database/implementations/redis/redis.repository";
import { AdaptersEnum } from "../enums";
import { ICacheRepository } from "../interfaces";

export const DataSourceAdapterMap = <Adapter extends AdaptersEnum = any, Client = any>() => {
  return new Map<AdaptersEnum, new (...args: any[]) => ICacheRepository<Adapter, Client>>([
    [AdaptersEnum.REDIS, RedisCacheRepository as unknown as new (...args: any[]) => ICacheRepository<Adapter, Client>],
    // [AdaptersEnum.MONGODB, RedisCacheRepository as unknown as new (...args: any[]) => ICacheRepository<Adapter, Client>],
  ]);
};

