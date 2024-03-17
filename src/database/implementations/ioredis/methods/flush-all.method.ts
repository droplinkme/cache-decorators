import { IORedisCacheRepository } from "../ioredis.repository";

export class FlushAll {
  constructor(private readonly repository: IORedisCacheRepository) { }
  public async execute(): Promise<void> {
    try {
      this.repository.validateConnection();
      await IORedisCacheRepository._client.flushall();
    } catch (err) {
      throw err;
    }
  }
}