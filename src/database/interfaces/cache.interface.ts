import { AdaptersEnum } from "@database/enums";
import { IResource } from "./resource.interface";
import { InvalidateActionInput, RemoveActionInput, RemoveByPrefixActionInput, RetrieveActionInput, RetrieveByPatternActionInput, RetrieveOrSaveActionInput, SaveActionInput } from "@database/types/action-input-types";

/**
 * Interface representing a cache repository.
 */
export abstract class ICacheRepository<Adapter extends AdaptersEnum = any, Client = any> extends IResource<Adapter, Client> {
  /**
   * Retrieves a value from the cache by key.
   * 
   * @param {RetrieveActionInput} input - An object containing the key of the value to retrieve.
   * @param {string} input.key - The key of the value to retrieve.
   * @returns {Promise<T | undefined>} - A promise that resolves to the retrieved value, or undefined if not found.
   */
  public abstract retrieve<T = any>({ key }: RetrieveActionInput): Promise<T | undefined>;
  /**
   * Saves a value to the cache with the specified key and optional time-to-live (TTL).
   * 
   * @param {SaveActionInput<T>} input - An object containing the key under which to save the value, the value itself, and an optional time-to-live (TTL) in seconds.
   * @param {T} input.value - The value to be saved in the cache.
   * @param {string} input.key - The key under which the value will be saved.
   * @param {number} [input.ttl] - Optional. The time-to-live (TTL) for the cache entry in seconds. If not provided, the entry will not expire.
   * @returns {Promise<T>} - A promise that resolves to the saved value.
   */
  public abstract save<T = any>({ key, value, ttl }: SaveActionInput<T>): Promise<T>;

  /**
   * Removes a value from the cache by key.
   * 
   * @param {RemoveActionInput} input - An object containing the key of the value to remove.
   * @param {string} input.key - The key of the value to remove.
   * @returns {Promise<void>} - A promise that resolves when the value is removed.
   */
  public abstract remove({ key }: RemoveActionInput): Promise<void>;

  /**
   * Removes all values from the cache whose keys start with the specified prefix.
   * 
   * @param {RemoveByPrefixActionInput} input - An object containing the prefix of the keys to remove.
   * @param {string} input.prefix - The prefix of the keys to remove.
   * @returns {Promise<void>} - A promise that resolves when the values are removed.
   */
  public abstract removeByPrefix({ prefix }: RemoveByPrefixActionInput): Promise<void>;
  /**
   * Clears all values from the cache.
   * 
   * @returns {Promise<void>} - A promise that resolves when the cache is cleared.
   */
  public abstract flushAll(): Promise<void>;

  /**
   * Retrieves all values from the cache that match the specified pattern.
   * 
   * @param {RetrieveByPatternActionInput} input - An object containing the pattern to match against the keys.
   * @param {string} input.pattern - The pattern to match against the keys.
   * @returns {Promise<T[]>} - A promise that resolves to an array of matched values.
   */
  public abstract retrieveByPattern<T = any>({ pattern }: RetrieveByPatternActionInput): Promise<T[]>;

  /**
   * Invalidates the cache entry identified by the specified key.
   * 
   * @param {InvalidateActionInput} input - An object containing the key of the cache entry to invalidate.
   * @param {string} input.key - The key of the cache entry to invalidate.
   * @returns {Promise<void>} - A promise that resolves when the cache entry is invalidated.
   */
  public abstract invalidate({ key }: InvalidateActionInput): Promise<void>;

  /**
   * Retrieves a value from the cache by key, or saves the result of the specified function if not found.
   * 
   * @param {RetrieveOrSaveActionInput<T>} input - An object containing the key under which to retrieve or save the value, the function to execute if the value is not found in the cache, an optional time-to-live (TTL) for the cached value, and an optional flag to bypass caching.
   * @param {string} input.key - The key under which to retrieve or save the value.
   * @param {() => Promise<T>} input.fn - The function to execute if the value is not found in the cache.
   * @param {number} [input.ttl] - Optional. The time-to-live (TTL) for the cached value. If not provided, the entry will not expire.
   * @param {boolean} [input.no_cache] - Optional. A flag to bypass caching. If true, the function will be executed regardless of the cache state.
   * @returns {Promise<T | undefined>} - A promise that resolves to the retrieved or saved value, or undefined if not found.
   */
  public abstract retrieveOrSave<T = any>({
    key,
    fn,
    ttl,
    no_cache
  }: RetrieveOrSaveActionInput<T>): Promise<T | undefined>;
}
