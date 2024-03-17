import { Adapter } from '@database/adapters';
import { IORedisAdapterOptions } from './ioredis-adapter-options.type';
import { MongoDBAdapterOptions } from './mongodb-adapter-options.type';

type AdapterOptions = {
  ioredis: IORedisAdapterOptions;
  mongodb: MongoDBAdapterOptions;
};

export type DataSourceOptions<T extends keyof typeof Adapter> = T extends keyof typeof Adapter ? AdapterOptions[T] : never;
