import { Action, Input } from "@core/common/types";
import { createCacheDecorator } from "../create-cache-decorator";
import { ICacheRepository } from "@database/interfaces/cache.interface";
import { getKey } from "@core/common/utils";

/**
 * Decorator that saves the output of a method into the cache.
 * 
 * @template I - The input type.
 * @template O - The output type.
 * @param {Omit<Input<I, O>, 'no_cache'>} input - The input data excluding the no_cache field.
 * @returns {MethodDecorator<I>} - The method decorator.
 */
export function CacheSave<I = any, O = any>(input: Omit<Input<I, O>, 'no_cache'>): MethodDecorator {
  /**
   * Action function that saves the output into the cache.
   * 
   * @type {Action<I, O, ICacheRepository>}
   */
  const action: Action<I, O, ICacheRepository> = async ({ instance, method, args, repository }) => {
    const output = await method.apply(instance, args);
    const key = await getKey({ ...input, input: args[0], output });
    await repository.save<O>(key, output, input.ttl);
    return output;
  };
  return createCacheDecorator<I, O>(input, action, true);
}