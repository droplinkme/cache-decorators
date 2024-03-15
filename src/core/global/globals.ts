import { MetadataArgsStorage } from "./metadata-args/metadata-args.storage"

/**
 * Gets metadata args storage.
 */
export function getMetadataArgsStorage(): MetadataArgsStorage {
  if (!global.metadataArgsStorage) {
    global.metadataArgsStorage = new MetadataArgsStorage()
  }
  return global.metadataArgsStorage
}