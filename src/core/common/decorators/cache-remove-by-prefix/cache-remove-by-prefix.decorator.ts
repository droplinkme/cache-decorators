import { Action, Input } from "../../types";
import { createCacheDecorator } from "../create-cache-decorator";
import { ICacheRepository } from "@database/interfaces";

/**
 * Decorator that removes cache entries by prefix based on predefined conditions.
 * 
 * @template I - The input type.
 * @param {Omit<Input<I>, 'ttl' | 'no_cache'>} input - The input data excluding TTL and no_cache fields.
 * @returns {MethodDecorator<I>} - The method decorator.
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