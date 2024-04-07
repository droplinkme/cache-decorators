import { Action, Input } from "@core/common/types";
import { createCacheDecorator } from "../create-cache-decorator";
import { ICacheRepository } from "@database/interfaces/cache.interface";
import { createHashedKey } from "@core/utils/create-hash.util";

/**
 * Decorator that retrieves cache entries based on predefined conditions.
 * 
 * @template I - The input type.
 * @param {Input<I>} input - The input data including TTL and no_cache fields.
 * @returns {MethodDecorator<I>} - The method decorator.
 * 
 * @example
 * Example 1: Using constant key and TTL
 * This method will retrieve cached data if available; otherwise, it will execute the original method and cache the result.
 * ```
 * @CacheRetrieve({ key: 'your-key', ttl: 60 })
 * async function handle(input: Input): Promise<any> {
 *    // your implementation
 * }
 * ```
 * @example
 * Example 2: With custom key function
 * This method will retrieve cached data if available using a custom key generated from the input arguments.
 * ```
 * @CacheRetrieve<Input>({
 *    key: (input) => {
 *      return `${input.param1}:${input.param2}`; // Custom key based on input parameters
 *    },
 *    ttl: 120
 * })
 * async function handle(input: Input): Promise<any> {
 *    // your implementation
 * }
 * ```
 */
export function CacheRetrieve<I = { [key: string]: any }>(input: Input<I>): MethodDecorator {
  /**
   * Action function that retrieves cache entries.
   * 
   * @type {Action<I, any, ICacheRepository>}
   */
  const action: Action<I, any, ICacheRepository> = async ({ instance, key, method, args, repository }) => {
    const fn = () => method.apply(instance, args);
    return await repository.retrieveOrSave({
      key: input.hashable_key ? createHashedKey(key) : key as string,
      fn,
      ttl: input.ttl,
      no_cache: input.no_cache,
      fallback: input.fallback
    });
  };

  return createCacheDecorator<I>(input, action);
}
