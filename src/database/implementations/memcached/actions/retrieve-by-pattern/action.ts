import { Action, ICacheRepository } from "@database/interfaces";
import { MemcachedRepository } from "../../repository";
import { RetrieveByPatternActionInput } from "@database/types";

export class RetrieveByPatternAction extends Action<RetrieveByPatternActionInput> {
  constructor(protected readonly repository: ICacheRepository) {
    super(repository)
  }

  protected async action<T = any>({ pattern }: RetrieveByPatternActionInput): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      MemcachedRepository._client.items((err, items) => {
        if (err) {
          reject(err);
          return;
        }

        const matchingItems: T[] = [];
        const keys = Object.keys(items);
        const keysToRetrieve = keys.filter((key) => key.includes(pattern));
        keysToRetrieve.forEach((key) => {
          MemcachedRepository._client.get(key, (err, value) => {
            if (err) {
              reject(err);
            } else {
              matchingItems.push(JSON.parse(value));
            }
          });
        })
        resolve(matchingItems)
      });
    });
  }
}