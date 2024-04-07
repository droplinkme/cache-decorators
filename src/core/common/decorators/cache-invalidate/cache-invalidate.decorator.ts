import { Action, Input } from "@core/common/types";
import { createCacheDecorator } from "../create-cache-decorator";
import { ICacheRepository } from "@database/interfaces/cache.interface";
import { createHashedKey } from "@core/utils/create-hash.util";

/**
 * Decorator that invalidate cache entries by based on predefined conditions.
 * 
 * @template I - The input type.
 * @param {Omit<Input<I>, 'ttl' | 'no_cache'>} input - The input data excluding TTL and no_cache fields.
 * @returns {MethodDecorator<I>} - The method decorator.
 * 
 * @example
 * Example: Removing cache entries by key
 * This example invalidate cache entries based on a specified key.
 * ```
 * @CacheInvalidate({ key: 'your-key' })
 * async function handle(input: Input): Promise<any> {
 *    // your implementation
 * }
 * ```
 * 
 * @example
 * Example 2: With custom key function
 * This method will invalidate cached data if available using a custom key generated from the input arguments.
 * ```
 * @CacheInvalidate<Input>({
 *    key: (input) => {
 *      return `${input.param1}:${input.param2}`; // Custom key based on input parameters
 *    }
 * })
 * async function handle(input: Input): Promise<any> {
 *    // your implementation
 * }
 * ```
 */
export function CacheInvalidate<I = { [key: string]: any }>(input: Omit<Input<I>, 'ttl' | 'no_cache' | 'fallback'>): MethodDecorator {
  /**
   * Action function that retrieves cache entries.
   * 
   * @type {Action<I, any, ICacheRepository>}
   */
  const action: Action<I, any, ICacheRepository> = async ({ instance, key, method, args, repository }) => {
    const output = await method.apply(instance, args);
    const use_key = input.hashable_key ? createHashedKey(key) : key as string;
    await repository.invalidate({ key: use_key });
    return output;
  };
  return createCacheDecorator<I>(input, action);
}