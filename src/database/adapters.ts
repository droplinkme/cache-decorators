import { IORedisCacheRepository } from "./implementations";

export const Adapter = {
  ioredis: IORedisCacheRepository,
  mongodb: IORedisCacheRepository
}
