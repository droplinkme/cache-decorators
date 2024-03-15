import { getKey } from "../utils";
import { Action, Input } from "../types";
import { getMetadataArgsStorage } from "@core/global/globals";
import { ICacheRepository } from "@database/interfaces";

/**
 * Creates a cache decorator based on the provided action.
 * 
 * @template I - The input type.
 * @template O - The output type.
 * @param {Input<I, O>} input - The input data.
 * @param {Action<I, O>} action - The action function to be executed.
 * @param {boolean} [ignore_key=false] - Whether to ignore the cache key generation.
 * @returns {MethodDecorator<I>} - The method decorator.
 */
export function createCacheDecorator<I = any, O = any>(input: Input<I, O>, action: Action<I, O, ICacheRepository>, ignore_key: boolean = false): MethodDecorator {
  return function (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> | void {
    const method = descriptor.value as Function;
    descriptor.value = async function (this: unknown, ...args: I[]): Promise<O | undefined> {
      const repository = getMetadataArgsStorage().getCacheRepository();
      const key = !ignore_key ? await getKey({ ...input, input: args[0] }) : undefined;
      return action({ instance: this, method, args, key, repository });
    } as unknown as TypedPropertyDescriptor<any>;
    return descriptor;
  };
}
