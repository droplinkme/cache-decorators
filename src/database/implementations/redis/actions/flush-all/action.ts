import { Action, ICacheRepository } from "@database/interfaces";
import { RedisCacheRepository } from "../../repository";

export class FlushAllAction extends Action {
  constructor(protected readonly repository: ICacheRepository) {
    super(repository)
  }
  protected async action(): Promise<void> {
    await RedisCacheRepository._client.flushall();
  }
}