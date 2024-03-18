import { AdaptersEnum } from "@database/enums";
import { IResource } from "./resource.interface";

/**
 * Interface representing a cache repository.
 */
export abstract class ICacheRepository<Adapter extends AdaptersEnum = any, Client = any> extends IResource<Adapter, Client> {
  /**
   * Retrieves a value from the cache by key.
   * 
   * @param {string} key - The key of the value to retrieve.
   * @returns {Promise<T | undefined>} - A promise that resolves to the retrieved value, or undefined if not found.
   */
  public abstract retrieve<T = any>(key: string): Promise<T | undefined>;

  /**
   * Saves a value to the cache with the specified key and optional time-to-live (TTL).
   * 
   * @param {string} key - The key under which to save the value.
   * @param {T} value - The value to save.
   * @param {number} [ttl] - Optional time-to-live (TTL) for the cached value.
   * @returns {Promise<T>} - A promise that resolves to the saved value.
   */
  public abstract save<T = any>(key: string, value: T, ttl?: number): Promise<T>;

  /**
   * Removes a value from the cache by key.
   * 
   * @param {string} key - The key of the value to remove.
   * @returns {Promise<void>} - A promise that resolves when the value is removed.
   */
  public abstract remove(key: string): Promise<void>;

  /**
   * Removes all values from the cache whose keys start with the specified prefix.
   * 
   * @param {string} prefix - The prefix of the keys to remove.
   * @returns {Promise<void>} - A promise that resolves when the values are removed.
   */
  public abstract removeByPrefix(prefix: string): Promise<void>;

  /**
   * Clears all values from the cache.
   * 
   * @returns {Promise<void>} - A promise that resolves when the cache is cleared.
   */
  public abstract flushAll(): Promise<void>;

  /**
   * Retrieves all values from the cache that match the specified pattern.
   * 
   * @param {string} pattern - The pattern to match against the keys.
   * @returns {Promise<T[]>} - A promise that resolves to an array of matched values.
   */
  public abstract retrieveByPattern<T = any>(pattern: string): Promise<T[]>;

  /**
   * Invalidates the cache entry identified by the specified key.
   * 
   * @param {string} key - The key of the cache entry to invalidate.
   * @returns {Promise<void>} - A promise that resolves when the cache entry is invalidated.
   */
  public abstract invalidate(key: string): Promise<void>;

  /**
   * Retrieves a value from the cache by key, or saves the result of the specified function if not found.
   * 
   * @param {string} key - The key under which to retrieve or save the value.
   * @param {() => Promise<T>} fn - The function to execute if the value is not found in the cache.
   * @param {number} [ttl] - Optional time-to-live (TTL) for the cached value.
   * @param {boolean} [no_cache] - Optional flag to bypass caching.
   * @returns {Promise<T | undefined>} - A promise that resolves to the retrieved or saved value, or undefined if not found.
   */
  public abstract retrieveOrSave<T = any>(
    key: string,
    fn: () => Promise<T>,
    ttl?: number,
    no_cache?: boolean
  ): Promise<T | undefined>;
}
