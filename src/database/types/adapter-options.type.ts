import { AdaptersEnum } from "@database/enums";
import { RedisAdapterOptions } from "./redis-adapter-options.type";
import { MemcachedAdapterOptions } from "./memcached-adapter-options.type";
import { MongoDBAdapterOptions } from "./mongodb-adapter-options.type";

export type AdapterOptions = {
  [AdaptersEnum.REDIS]: RedisAdapterOptions;
  [AdaptersEnum.MEMCACHED]: MemcachedAdapterOptions;
  // [AdaptersEnum.MONGODB]: MongoDBAdapterOptions;
};