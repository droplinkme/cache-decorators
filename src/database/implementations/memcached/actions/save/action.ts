import { Action, ICacheRepository } from "@database/interfaces";
import { MemcachedRepository } from "../../repository";
import { SaveActionInput } from "@database/types";

export class SaveAction extends Action<SaveActionInput> {
  constructor(protected readonly repository: ICacheRepository) {
    super(repository)
  }

  protected async action<T = any>({ key, value, ttl }: SaveActionInput<T>): Promise<T> {
    const valueStr = JSON.stringify(value);
    return new Promise<T>((resolve, reject) => {
      MemcachedRepository._client.set(key, valueStr, ttl || 0, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      });
    });
  }
}