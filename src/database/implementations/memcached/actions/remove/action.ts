import { Action, ICacheRepository } from "@database/interfaces";
import { MemcachedRepository } from "../../repository";
import { RemoveActionInput } from "@database/types";

export class RemoveAction extends Action<RemoveActionInput> {
  constructor(protected readonly repository: ICacheRepository) {
    super(repository)
  }

  protected async action({ key }: RemoveActionInput): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      MemcachedRepository._client.del(key, (err, _) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}