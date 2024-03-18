import { IORedisCacheRepository } from "../ioredis.repository";

export class Retrieve {
  constructor(private readonly repository: IORedisCacheRepository) { }
  public async execute<T = any>(key: string): Promise<T | undefined> {
    try {
      this.repository.validateConnection();
      const valueStr = await IORedisCacheRepository._client?.get(key);
      if (valueStr) return JSON.parse(valueStr);
    } catch (err) {
      throw err;
    }
  }
}