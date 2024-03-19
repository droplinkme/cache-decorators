import { ICacheRepository } from "./cache.interface";

export abstract class Action<Input = any> {
  constructor(protected readonly repository: ICacheRepository) { }
  protected abstract action<T = any>(...args: Input[]): Promise<T | T[] | undefined | void> | void

  public async execute<T = any>(...args: Input[]): Promise<T> {
    try {
      this.repository.validateConnection();
      return await this.action<T>(...args) as T;
    } catch (err) {
      this.repository.logger(err);
      throw err;
    }
  }
}