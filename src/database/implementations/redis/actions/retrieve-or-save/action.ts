import { CachePrefixEnum } from "@core/enums";
import { Action, ICacheRepository } from "@database/interfaces";
import { RetrieveOrSaveActionInput } from "@database/types";

export class RetrieveOrSaveAction extends Action<RetrieveOrSaveActionInput> {
  constructor(protected readonly repository: ICacheRepository) {
    super(repository)
  }

  protected async action<T = any>({ no_cache, key, fn, ttl, fallback }: RetrieveOrSaveActionInput<T>): Promise<T | undefined> {
    if (!no_cache) {
      const value = await this.repository.retrieve<T>({ key });
      if (value) return value;
    }
    const fallback_key = `${CachePrefixEnum.FALLBACK}/${key}`;
    try {
      const value = await fn();

      if (fallback) await this.repository.save({ key: fallback_key, value });

      return await this.repository.save({ key, value, ttl });
    } catch (error: any) {
      if (fallback) {
        const value = await this.repository.retrieve<T>({ key: fallback_key });
        if (value) return value;
      };

      throw error
    }
  }
}