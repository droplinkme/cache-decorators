import { Action, ICacheRepository } from "@database/interfaces";
import { RedisCacheRepository } from "../../redis.repository";
import { InvalidateActionInput } from "@database/types";

export class InvalidateAction extends Action<InvalidateActionInput> {
  constructor(protected readonly repository: ICacheRepository) {
    super(repository)
  }
  protected async action({ key }: InvalidateActionInput): Promise<void> {
    await RedisCacheRepository._client.expire(key, 1);
  }
}