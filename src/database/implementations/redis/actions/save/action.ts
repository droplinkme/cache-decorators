import { Action, ICacheRepository } from "@database/interfaces";
import { RedisCacheRepository } from "../../redis.repository";
import { SaveActionInput } from "@database/types";
import { CachePrefixEnum } from "@core/enums";

export class SaveAction extends Action<SaveActionInput> {
  constructor(protected readonly repository: ICacheRepository) {
    super(repository)
  }

  protected async action<T = any>({ key, value, ttl, fallback }: SaveActionInput<T>): Promise<T> {
    const value_str = JSON.stringify(value);
    ttl
      ? await RedisCacheRepository._client.set(key, value_str, 'EX', ttl)
      : await RedisCacheRepository._client.set(key, value_str);

    if (fallback) await RedisCacheRepository._client.set(`${CachePrefixEnum.FALLBACK}/${key}`, value_str);

    return value;
  }
}