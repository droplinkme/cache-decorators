import { IORedisCacheRepository } from "./implementations";

export const adapter = {
  ioredis: () => IORedisCacheRepository
}