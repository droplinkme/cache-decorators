import { Action } from "@database/interfaces";
import { RedisCacheRepository } from "../redis.repository";

export class RemoveByPrefixAction extends Action {
  constructor(protected readonly repository: RedisCacheRepository) {
    super(repository)
  }

  protected async execute(prefix: string): Promise<void> {
    const pipeline = RedisCacheRepository._client?.pipeline();

    await RedisCacheRepository._client?.keys(`${prefix}*`)
      .then((keys) => { keys.forEach((key) => pipeline?.del(key)); });

    await pipeline?.exec();
  }
}