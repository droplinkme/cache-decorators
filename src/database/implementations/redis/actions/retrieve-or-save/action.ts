import { Action, ICacheRepository } from "@database/interfaces";
import { RetrieveOrSaveActionInput } from "@database/types";

export class RetrieveOrSaveAction extends Action<RetrieveOrSaveActionInput> {
  constructor(protected readonly repository: ICacheRepository) {
    super(repository)
  }

  protected async action<T = any>({ no_cache, key, fn, ttl }: RetrieveOrSaveActionInput<T>): Promise<T | undefined> {
    if (!no_cache) {
      const cachedValue = await this.repository.retrieve({ key });
      if (cachedValue) return cachedValue;
    }
    const value = await fn();
    return await this.repository.save({ key, value, ttl });
  }
}