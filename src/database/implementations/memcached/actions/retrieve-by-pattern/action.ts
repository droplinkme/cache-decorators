import { Action, ICacheRepository } from "@database/interfaces";
import { MemcachedRepository } from "../../repository";
import { RetrieveByPatternActionInput } from "@database/types";

export class RetrieveByPatternAction extends Action<RetrieveByPatternActionInput> {
  constructor(protected readonly repository: ICacheRepository) {
    super(repository)
  }

  protected async action<T = any>({ pattern }: RetrieveByPatternActionInput): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      MemcachedRepository._client.items((err: any, items: any[]) => {
        if (err) {
          reject(err);
        } else {
          const matchingItems: T[] = [];
          items.forEach((item) => {
            if (item.key.includes(pattern)) {
              const value = JSON.parse(item.value);
              matchingItems.push(value);
            }
          });
          resolve(matchingItems);
        }
      });
    });
  }
}