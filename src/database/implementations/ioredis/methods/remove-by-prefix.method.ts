import { IORedisCacheRepository } from "../ioredis.repository";

export class RemoveByPrefix {
  constructor(private readonly repository: IORedisCacheRepository) { }
  public async execute(prefix: string): Promise<void> {
    try {
      this.repository.validateConnection();

      const pipeline = IORedisCacheRepository._client?.pipeline();

      await IORedisCacheRepository._client?.keys(`${prefix}*`)
        .then((keys) => { keys.forEach((key) => pipeline?.del(key)); });

      await pipeline?.exec();
    } catch (err) {
      throw err;
    }
  }
}