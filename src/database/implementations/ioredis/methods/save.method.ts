import { IORedisCacheRepository } from "../ioredis.repository";

export class Save {
  constructor(private readonly repository: IORedisCacheRepository) { }
  public async execute<T = any>(key: string, value: T, ttl?: number): Promise<T> {
    try {
      this.repository.validateConnection();
      const valueStr = JSON.stringify(value);
      ttl
        ? await this.repository._client?.set(key, valueStr, 'EX', ttl)
        : await this.repository._client?.set(key, valueStr);
    } catch (err) {
      throw err;
    }
    return value;
  }
}