import { Action } from "@database/interfaces";
import { RedisCacheRepository } from "../redis.repository";

export class RetrieveAction extends Action {
  constructor(protected readonly repository: RedisCacheRepository) {
    super(repository)
  }

  protected async execute<T = any>(key: string): Promise<T | undefined> {
    const value = await RedisCacheRepository._client?.get(key);
    if (value) {
      return JSON.parse(value)
    };
  }
}