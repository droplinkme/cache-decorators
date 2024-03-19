import { ICacheRepository, RetrieveOrSaveActionInput } from ".."
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
  public async retrieveOrSave<T = any>({ fn }: RetrieveOrSaveActionInput): Promise<T | undefined> {
    return await fn();
  }

}