import { Action, Input } from "@core/common/types";
import { createCacheDecorator } from "../create-cache-decorator";
import { ICacheRepository } from "@database/interfaces/cache.interface";
import { getKey } from "@core/common/utils";
import { createHashedKey } from "@core/utils/create-hash.util";

/**
 * Decorator that caches the output of a method based on predefined conditions.
 * 
 * @template I - The input type.
 * @template O - The output type.
 * @param {Omit<Input<I, O>, 'no_cache'>} input - The input data excluding the 'no_cache' field.
 * @returns {MethodDecorator<I>} - The method decorator.
 * 
 * @example
 * Example 1: Using a constant key and TTL
 * This example caches the output using a constant key and TTL.
 * ```
 * @CacheSave({ key: 'your-key', ttl: 60 })
 * async function handle(input: Input): Promise<Output> {
 *    // Your implementation
 * }
 * ```
 * @example
 * Example 2: Using a custom key function
 * This example caches the output using a custom key generated from the input and output parameters.
 * ```
 * @CacheSave<Input, Output>({
 *    key: (input, output) => {
 *      return `your-key/${input.param1}/${output?.param2}`
 *    }
 * })
 * async function handle(input: Input): Promise<Output> {
 *    // Your implementation
 * }
 * ```
 */
export function CacheSave<I = any, O = any>(input: Omit<Input<I, O>, 'no_cache'>): MethodDecorator {
  /**
   * Action function that saves the output into the cache.
   * 
   * @type {Action<I, O, ICacheRepository>}
   */
  const action: Action<I, O, ICacheRepository> = async ({ instance, method, args, repository }) => {
    const output = await method.apply(instance, args);
    const key = await getKey({ ...input, input: args, output });
    await repository.save<O>({
      key: input.hashable_key ? createHashedKey(key) : key as string,
      value: output,
      ttl: input.ttl,
      fallback: input.fallback
    });
    return output;
  };
  return createCacheDecorator<I, O>(input, action, true);
}
