import { Action } from "@database/interfaces";
import { RedisCacheRepository } from "../redis.repository";

export class InvalidateAction extends Action {
  constructor(protected readonly repository: RedisCacheRepository) {
    super(repository)
  }
  protected async execute(key: string): Promise<void> {
    await RedisCacheRepository._client?.expire(key, 1);
  }
}