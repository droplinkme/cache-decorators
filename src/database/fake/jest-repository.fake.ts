import { ICacheRepository } from "@database/interfaces";
import { JestFakeResource } from "./jest-resource.fake";
import { RetrieveOrSaveActionInput } from "@database/types";

export class JestFakeCacheRepository extends JestFakeResource implements ICacheRepository {
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