import { NoCacheRepositoryExceptions } from "@core/exceptions";
import { AdaptersEnum } from "@database/enums";
import { ICacheRepository } from "@database/interfaces"

export class MetadataArgsStorage {
  private cacheRepository?: ICacheRepository<any, any>

  getCacheRepository<Adapter extends AdaptersEnum, Client = any>(): ICacheRepository<Adapter, Client> {
    if (!this.cacheRepository) {
      throw new NoCacheRepositoryExceptions("Cache repository not initialized");

    }
    return this.cacheRepository
  }

  setCacheRepository<Client = any>(repository: ICacheRepository<any, Client>) {
    this.cacheRepository = repository
  }
}