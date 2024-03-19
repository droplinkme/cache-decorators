import { Action, ICacheRepository } from "@database/interfaces";
import { RedisCacheRepository } from "../../redis.repository";
import { RetrieveActionInput } from "@database/types";

export class RetrieveAction extends Action {
  constructor(protected readonly repository: ICacheRepository) {
    super(repository)
  }

  protected async action<T = any>({ key }: RetrieveActionInput): Promise<T | undefined> {
    const value = await RedisCacheRepository._client?.get(key);
    if (value) {
      return JSON.parse(value)
    };
  }
}