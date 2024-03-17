import { AdaptersEnum } from "./enums";
import { IORedisCacheRepository } from "./implementations";
import { ICacheRepository } from "./interfaces";
import { DataSourceOptions } from "./types";

const Adapters = {
  [AdaptersEnum.REDIS]: IORedisCacheRepository,
  [AdaptersEnum.MONGODB]: IORedisCacheRepository
}

// const items: [AdaptersEnum, new (...args: any[]) => ICacheRepository<any, any>][] = Object.entries(Adapters).map(([key, value]) => {
//   return [AdaptersEnum[key as keyof typeof AdaptersEnum], value];
// });

// Assuming IORedisCacheRepository is correctly typed as a constructor
// that matches the expected signature for ICacheRepository<Adapter, any>

export const AdapterMap = <Adapter extends AdaptersEnum = any, Client = any>() => {
  return new Map<AdaptersEnum, new (...args: any[]) => ICacheRepository<Adapter, Client>>([
    [AdaptersEnum.REDIS, IORedisCacheRepository as unknown as new (...args: any[]) => ICacheRepository<Adapter, Client>],
    [AdaptersEnum.MONGODB, IORedisCacheRepository as unknown as new (...args: any[]) => ICacheRepository<Adapter, Client>],
  ]);
};

