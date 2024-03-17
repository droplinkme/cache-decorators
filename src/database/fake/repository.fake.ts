import { ICacheRepository } from ".."
import { FakeResource } from "./resource.fake";

export class FakeCacheRepository extends FakeResource implements ICacheRepository {
  constructor() {
    super()
  }
  public retrieve = jest.fn();
  public save = jest.fn();
  public remove = jest.fn();
  public removeByPrefix = jest.fn();
  public flushAll = jest.fn();
  public retrieveByPattern = jest.fn();
  public createHashedKey = jest.fn();
  public invalidate = jest.fn();
  public async retrieveOrSave<T = any>(key: string, fn: () => Promise<T>, ttl?: number | undefined, no_cache?: boolean | undefined): Promise<T | undefined> {
    return await fn();
  }

}