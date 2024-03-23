import { Action, ICacheRepository } from "@database/interfaces";
import { MemcachedRepository } from "../../repository";
import { RetrieveActionInput } from "@database/types";

export class RetrieveAction extends Action {
  constructor(protected readonly repository: ICacheRepository) {
    super(repository)
  }

  protected async action<T = any>({ key }: RetrieveActionInput): Promise<T | undefined> {
    return new Promise<T | undefined>((resolve, reject) => {
      MemcachedRepository._client.get(key, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data ? JSON.parse(data) : undefined);
        }
      });
    });
  }
}