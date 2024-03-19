import { Action, ICacheRepository } from "@database/interfaces";
import { RedisCacheRepository } from "../../redis.repository";
import { RemoveActionInput } from "@database/types";

export class RemoveAction extends Action<RemoveActionInput> {
  constructor(protected readonly repository: ICacheRepository) {
    super(repository)
  }

  protected async action({ key }: RemoveActionInput): Promise<void> {
    await RedisCacheRepository._client.del(key);
  }
}