import { Action, Input } from "../../types";
import { createCacheDecorator } from "../create-cache-decorator";
import { ICacheRepository } from "@database/interfaces";

/**
 * Decorator that retrieves cache entries based on predefined conditions.
 * 
 * @template I - The input type.
 * @param {Input<I>} input - The input data including TTL and no_cache fields.
 * @returns {MethodDecorator<I>} - The method decorator.
 */
export function CacheRetrieve<I = { [key: string]: any }>(input: Input<I>): MethodDecorator {
  /**
   * Action function that retrieves cache entries.
   * 
   * @type {Action<I, any, ICacheRepository>}
   */
  const action: Action<I, any, ICacheRepository> = async ({ instance, key, method, args, repository, }) => {
    const fn = () => method.apply(instance, args);
    return await repository.recoverOrSave(key as string, fn, input.ttl, input.no_cache);
  };

  return createCacheDecorator<I>(input, action);
}