import { IORedisCacheRepository } from "../ioredis.repository";

export class RetrieveByPattern {
  constructor(private readonly repository: IORedisCacheRepository) { }
  public async execute<T = any>(pattern: string): Promise<T[]> {
    try {
      this.repository.validateConnection();

      const stream = this.repository._client?.scanStream({
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
              const result = await this.repository._client?.get(key);
              if (result) {
                return JSON.parse(result);
              }
            })
          );

          resolve(values);
        });
      });

      return result;
    } catch (err) {
      throw err;
    }
  }
}