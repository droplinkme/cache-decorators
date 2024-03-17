import { IORedisCacheRepository } from "../ioredis.repository";

export class RetrieveOrSave {
  constructor(private readonly repository: IORedisCacheRepository) { }
  public async execute<T = any>(
    key: string,
    fn: () => Promise<T>,
    ttl?: number,
    no_cache?: boolean
  ): Promise<T | undefined> {
    if (!no_cache) {
      const cachedValue = await this.repository.retrieve(key);
      if (cachedValue) return cachedValue;
    }

    try {
      const value = await fn();
      return await this.repository.save(key, value, ttl);
    } catch (error: any) {
      throw error;
    }
  }
}