import { AdaptersEnum } from "./enums";
import { IORedisCacheRepository } from "./implementations";
import { ICacheRepository } from "./interfaces";

export const AdapterMap = <Adapter extends AdaptersEnum = any, Client = any>() => {
  return new Map<AdaptersEnum, new (...args: any[]) => ICacheRepository<Adapter, Client>>([
    [AdaptersEnum.REDIS, IORedisCacheRepository as unknown as new (...args: any[]) => ICacheRepository<Adapter, Client>],
    [AdaptersEnum.MONGODB, IORedisCacheRepository as unknown as new (...args: any[]) => ICacheRepository<Adapter, Client>],
  ]);
};

