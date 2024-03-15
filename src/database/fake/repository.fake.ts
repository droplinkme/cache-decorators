import { ICacheRepository } from ".."

export class FakeCacheRepository implements ICacheRepository {
  public recover = jest.fn();
  public save = jest.fn();
  public remove = jest.fn();
  public removeByPrefix = jest.fn();
  public flushAll = jest.fn();
  public getValuesByPattern = jest.fn();
  public createHashedKey = jest.fn();
  public invalidate = jest.fn();
  public async recoverOrSave<T = any>(key: string, fn: () => Promise<T>, ttl?: number | undefined, no_cache?: boolean | undefined): Promise<T | undefined> {
    return await fn();
  }

}