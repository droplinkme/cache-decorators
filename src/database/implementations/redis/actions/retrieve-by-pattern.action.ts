import { Action } from "@database/interfaces";
import { RedisCacheRepository } from "../redis.repository";

export class RetrieveByPatternAction extends Action {
  constructor(protected readonly repository: RedisCacheRepository) {
    super(repository)
  }

  protected async execute<T = any>(pattern: string): Promise<T[]> {
    const stream = RedisCacheRepository._client?.scanStream({
      match: pattern,
      count: 10
    });

    const result: T[] = await new Promise((resolve, reject) => {
      const keys = new Set<string>();

      stream?.on('data', (data) => {
        data.forEach(keys.add, keys);
      });

      stream?.on('error', (err) => {
        reject(err);
      });

      stream?.on('end', async () => {
        if (keys.size === 0) {
          resolve([]);
        }
        const values: T[] = await Promise.all<T>(
          [...keys].map(async (key) => {
            const result = await RedisCacheRepository._client?.get(key);
            if (result) {
              return JSON.parse(result);
            }
          })
        );

        resolve(values);
      });
    });

    return result;
  }
}