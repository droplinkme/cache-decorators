import { IORedisCacheRepository } from "../ioredis.repository";

export class Remove {
  constructor(private readonly repository: IORedisCacheRepository) { }
  public async execute(key: string): Promise<void> {
    try {
      this.repository.validateConnection();

      await this.repository._client?.del(key);
    } catch (err) {
      throw err;
    }
  }
}