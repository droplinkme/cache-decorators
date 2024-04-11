import { ICacheRepository, RetrieveOrSaveActionInput } from ".."
import { VitestFakeResource } from "./vitest-resource.fake";
import { vi } from 'vitest'

export class VitestFakeCacheRepository extends VitestFakeResource implements ICacheRepository {
  constructor() {
    super()
  }
  public retrieve = vi.fn();
  public save = vi.fn();
  public remove = vi.fn();
  public removeByPrefix = vi.fn();
  public flushAll = vi.fn();
  public retrieveByPattern = vi.fn();
  public createHashedKey = vi.fn();
  public invalidate = vi.fn();
  public async retrieveOrSave<T = any>({ fn }: RetrieveOrSaveActionInput): Promise<T | undefined> {
    return await fn();
  }

}