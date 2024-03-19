import { Action, ICacheRepository } from "@database/interfaces";
import { RedisCacheRepository } from "../../redis.repository";
import { SaveActionInput } from "@database/types";

export class SaveAction extends Action<SaveActionInput> {
  constructor(protected readonly repository: ICacheRepository) {
    super(repository)
  }

  protected async action<T = any>({ key, value, ttl }: SaveActionInput<T>): Promise<T> {
    const valueStr = JSON.stringify(value);
    ttl
      ? await RedisCacheRepository._client.set(key, valueStr, 'EX', ttl)
      : await RedisCacheRepository._client.set(key, valueStr);
    return value;
  }
}