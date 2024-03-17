import { IORedisCacheRepository } from "../ioredis.repository";

export class RemoveByPrefix {
  constructor(private readonly repository: IORedisCacheRepository) { }
  public async execute(prefix: string): Promise<void> {
    try {
      this.repository.validateConnection();

      const pipeline = this.repository._client?.pipeline();

      await this.repository._client?.keys(`${prefix}*`)
        .then((keys) => { keys.forEach((key) => pipeline?.del(key)); });

      await pipeline?.exec();
    } catch (err) {
      throw err;
    }
  }
}