import { AdaptersEnum } from "@database/enums";
import { IORedisAdapterOptions } from "./ioredis-adapter-options.type";
import { MongoDBAdapterOptions } from "./mongodb-adapter-options.type";

export type AdapterOptions = {
  [AdaptersEnum.REDIS]: IORedisAdapterOptions;
  // [AdaptersEnum.MONGODB]: MongoDBAdapterOptions;
};