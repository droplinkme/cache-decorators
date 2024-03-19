import { Action, ICacheRepository } from "@database/interfaces";
import { RedisCacheRepository } from "../../redis.repository";
import { RemoveByPrefixActionInput } from "@database/types";

export class RemoveByPrefixAction extends Action<RemoveByPrefixActionInput> {
  constructor(protected readonly repository: ICacheRepository) {
    super(repository)
  }

  protected async action({ prefix }: RemoveByPrefixActionInput): Promise<void> {
    const pipeline = RedisCacheRepository._client.pipeline();

    await RedisCacheRepository._client.keys(`${prefix}*`)
      .then((keys) => { keys.forEach((key) => pipeline.del(key)); });

    await pipeline.exec();
  }
}