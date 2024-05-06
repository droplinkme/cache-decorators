import { Key } from "./key.type";

/**
 * Represents the input configuration for caching operations.
 * @template I - The type of the input parameter.
 * @template O - The type of the output parameter.
 */
export type Input<I = any, O = any> = {
  /**
    * Indicates whether caching should be skipped for this operation.
    * @type {boolean}
    */
  no_cache?: boolean;

  /**
    * The time-to-live (TTL) for the cache entry, in seconds.
    * @type {number}
    */
  ttl?: number;

  /**
    * The key used to identify the cache entry.
    * @type {Key<I[], O>}
    */
  key: Key<I, O>;

  /**
    * Determines if the key should be hashed before being used in cache operations.
    * @type {boolean}
    */
  hashable_key?: boolean;

  /**
    * Determines if the cache store and returns a fallback for the last cached value if any error.
    * @type {boolean}
    */
  fallback?: boolean
}