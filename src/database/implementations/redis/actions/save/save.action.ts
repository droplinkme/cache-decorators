import { Action, ICacheRepository } from "@database/interfaces";
import { RedisCacheRepository } from "../../redis.repository";
import { Input } from "./input";

export class SaveAction extends Action<Input> {
  constructor(protected readonly repository: ICacheRepository) {
    super(repository)
  }

  protected async execute<T = any>({ key, value, ttl }: Input<T>): Promise<T> {
    const valueStr = JSON.stringify(value);
    ttl
      ? await RedisCacheRepository._client?.set(key, valueStr, 'EX', ttl)
      : await RedisCacheRepository._client?.set(key, valueStr);
    return value;
  }
}