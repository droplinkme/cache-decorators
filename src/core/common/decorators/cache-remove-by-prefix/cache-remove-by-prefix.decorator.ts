import { Action, Input } from "@core/common/types";
import { createCacheDecorator } from "../create-cache-decorator";
import { ICacheRepository } from "@database/interfaces/cache.interface";

/**
 * Decorator that removes cache entries by prefix based on predefined conditions.
 * 
 * @template I - The input type.
 * @param {Omit<Input<I>, 'ttl' | 'no_cache'>} input - The input data excluding TTL and no_cache fields.
 * @returns {MethodDecorator<I>} - The method decorator.
 * 
 * @example
 * Example: Removing cache entries by key prefix
 * This example removes cache entries based on a specified prefix.
 * ```
 * @CacheRemoveByPrefix({ key: 'your-key-prefix' })
 * async function handle(input: Input): Promise<any> {
 *    // your implementation
 * }
 * ```
 * 
 * @example
 * Example 2: With custom key prefix function
 * This method will removes cached data if available using a custom key generated from the input arguments.
 * ```
 * @CacheRemoveByPrefix<Input>({
 *    key: (input) => {
 *      return `${input.param1}:${input.param2}`; // Custom key prefix based on input parameters
 *    }
 * })
 * async function handle(input: Input): Promise<any> {
 *    // your implementation
 * }
 * ```
 */
export function CacheRemoveByPrefix<I = { [key: string]: any }>(input: Omit<Input<I>, 'ttl' | 'no_cache'>): MethodDecorator {
  /**
   * Action function that retrieves cache entries.
   * 
   * @type {Action<I, any, ICacheRepository>}
   */
  const action: Action<I, any, ICacheRepository> = async ({ instance, key, method, args, repository, }) => {
    const output = await method.apply(instance, args);
    await repository.removeByPrefix(key as string);
    return output;
  };
  return createCacheDecorator<I>(input, action);
}
