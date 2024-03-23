import { Action, ICacheRepository } from "@database/interfaces";
import { MemcachedRepository } from "../../repository";
import { InvalidateActionInput } from "@database/types";

export class InvalidateAction extends Action<InvalidateActionInput> {
  constructor(protected readonly repository: ICacheRepository) {
    super(repository)
  }
  protected async action({ key }: InvalidateActionInput): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      MemcachedRepository._client.touch(key, 1, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}