import { Action } from "@database/interfaces";
import { RedisCacheRepository } from "../../redis.repository";

export class FlushAllAction extends Action {
  constructor(protected readonly repository: RedisCacheRepository) {
    super(repository)
  }
  protected async action(): Promise<void> {
    await RedisCacheRepository._client?.flushall();
  }
}