import { Action, ICacheRepository } from "@database/interfaces";
import { MemcachedRepository } from "../../repository";
import { RemoveByPrefixActionInput } from "@database/types";

export class RemoveByPrefixAction extends Action<RemoveByPrefixActionInput> {
  constructor(protected readonly repository: ICacheRepository) {
    super(repository)
  }

  protected async action({ prefix }: RemoveByPrefixActionInput): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      MemcachedRepository._client.items((err, items) => {
        if (err) {
          reject(err);
        } else {
          const keys = Object.keys(items);
          const keysToDelete = keys.filter((key) => key.startsWith(prefix));
          keysToDelete.forEach((key) => {
            MemcachedRepository._client.del(key, (deleteErr: any) => {
              if (deleteErr) {
                reject(deleteErr);
              }
            });
          });
          resolve();
        }
      });
    });
  }
}