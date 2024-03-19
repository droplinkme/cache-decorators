import { Action } from "@database/interfaces";
import { RedisCacheRepository } from "../redis.repository";

export class RetrieveOrSaveAction extends Action {
  constructor(protected readonly repository: RedisCacheRepository) {
    super(repository)
  }

  protected async execute<T = any>(
    key: string,
    fn: () => Promise<T>,
    ttl?: number,
    no_cache?: boolean
  ): Promise<T | undefined> {
    if (!no_cache) {
      const cachedValue = await this.repository.retrieve(key);
      if (cachedValue) return cachedValue;
    }
    const value = await fn();
    return await this.repository.save(key, value, ttl);
  }
}