import { IORedisCacheRepository } from "../ioredis.repository";

export class Invalidate {
  constructor(private readonly repository: IORedisCacheRepository) { }
  public async execute(key: string): Promise<void> {
    try {
      this.repository.validateConnection();
      await this.repository._client?.expire(key, 1);
    } catch (err) {
      throw err;
    }
  }
}