import { Action, ICacheRepository } from "@database/interfaces";
import { MemcachedRepository } from "../../repository";

export class FlushAllAction extends Action {
  constructor(protected readonly repository: ICacheRepository) {
    super(repository)
  }
  protected async action(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      MemcachedRepository._client.flush((err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}