import { randomUUID } from "crypto";
import { DataSource } from "@database/datasource";
import { CacheInvalidate, CacheRemove, CacheRemoveByPrefix, CacheRetrieve, CacheSave } from "@core/common";
import { AdaptersEnum } from "src";

export const MOCK_KEY = randomUUID()
export const OUTPUT_KEY = randomUUID()
export const MOCK_TTL = 10

export type Input = {
  id: string
}

export type Output = {
  id: string;
  key: string;
  success: boolean
}

export class UseCase {
  constructor() {
    DataSource.initialize<AdaptersEnum.REDIS>(AdaptersEnum.REDIS, {
      host: process.env.HOST as string,
      port: Number(process.env.PORT),
    })
  }

  @CacheSave({ key: MOCK_KEY, ttl: 60 })
  async save(input: Input): Promise<Output> {
    return { ...input, key: OUTPUT_KEY, success: true };
  }

  @CacheSave<Input, Output>({
    key: (input, output) => `${MOCK_KEY}/${input.id}/${output?.key}`,
  })
  async saveWithCustomKey(input: Input): Promise<Output> {
    return { ...input, key: OUTPUT_KEY, success: true };
  }

  @CacheRetrieve({ key: MOCK_KEY, ttl: 60 })
  async retrieve(input: Input): Promise<Output> {
    return { ...input, key: OUTPUT_KEY, success: true };
  }

  @CacheRetrieve<Input & { key: string }>({
    key: (input) => `${MOCK_KEY}/${input.id}/${input?.key}`,
  })
  async retrieveWithCustomKey(input: Input & { key: string }): Promise<Output> {
    return { ...input, success: true };
  }

  @CacheRetrieve({ key: MOCK_KEY, no_cache: true })
  async retrieveWithNoCache(input: Input): Promise<Output> {
    return { ...input, key: OUTPUT_KEY, success: true };
  }

  @CacheRemove({ key: MOCK_KEY })
  async remove(input: Input): Promise<Output> {
    return { ...input, key: OUTPUT_KEY, success: true };
  }

  @CacheRemove<Input & { key: string }>({
    key: (input) => `${MOCK_KEY}/${input.id}/${input.key}`,
  })
  async removeWithCustomKey(input: Input & { key: string }): Promise<Output> {
    return { ...input, success: true };
  }

  @CacheRemoveByPrefix({ key: MOCK_KEY })
  async removeByPrefix(input: Input): Promise<Output> {
    return { ...input, key: OUTPUT_KEY, success: true };
  }

  @CacheRemoveByPrefix<Input & { key: string }>({
    key: (input) => `${MOCK_KEY}/${input.id}/${input.key}`,
  })
  async removeByPrefixWithCustomKey(input: Input & { key: string }): Promise<Output> {
    return { ...input, success: true };
  }

  @CacheInvalidate({ key: MOCK_KEY })
  async invalidate(input: Input): Promise<Output> {
    return { ...input, key: OUTPUT_KEY, success: true };
  }

  @CacheInvalidate<Input & { key: string }>({
    key: (input) => `${MOCK_KEY}/${input.id}/${input.key}`,
  })
  async invalidateWithCustomKey(input: Input & { key: string }): Promise<Output> {
    return { ...input, success: true };
  }
}