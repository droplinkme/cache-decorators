import { NoCacheRepositoryExceptions } from "@core/exceptions";
import { ICacheRepository } from "@database/interfaces"

export class MetadataArgsStorage {
  private cacheRepository?: ICacheRepository

  getCacheRepository(): ICacheRepository {
    if (!this.cacheRepository) {
      throw new NoCacheRepositoryExceptions("Cache repository not initialized");

    }
    return this.cacheRepository
  }

  setCacheRepository(repository: ICacheRepository) {
    this.cacheRepository = repository
  }
}