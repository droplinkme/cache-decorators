import { ICacheRepository } from "./interfaces";
import { AdapterMap } from "./adapters";
import { getMetadataArgsStorage } from "@core/global/globals";
import { NoCacheRepositoryExceptions } from "@core/exceptions";
import { DataSourceOptions } from "./types";
import { AdaptersEnum } from "./enums";
import { Redis } from "ioredis";

/**
 * Class representing a data source.
 */
export class DataSource {

  /**
   * Initializes the data source with the provided options.
   * 
   * @param {DataSourceOptions} options - The options to initialize the data source.
   * @returns {Promise<ICacheRepository>} - A promise that resolves to the initialized cache repository.
   */
  async initialize<Adapter extends AdaptersEnum = any, Client = any>(adapter: Adapter, options: DataSourceOptions<Adapter>): Promise<ICacheRepository<Adapter, Client>> {
    const Repository = AdapterMap<Adapter, Client>().get(adapter);

    if (!Repository) {
      throw new NoCacheRepositoryExceptions("No cache adapter found.");
    }

    const repository = await new Repository().connect(options)
    getMetadataArgsStorage().setCacheRepository(repository)
    return repository
  }

  /**
   * Retrieves the cache repository instance.
   * 
   * @returns {ICacheRepository} - The cache repository instance.
   * @throws {NoCacheRepositoryExceptions} - Throws an exception if the cache repository instance is not found.
   */
  public getRepository<Adapter extends AdaptersEnum, Client = any>(): ICacheRepository<Adapter, Client> {
    const repository = getMetadataArgsStorage().getCacheRepository()
    if (!repository) throw new NoCacheRepositoryExceptions();
    return repository;
  }

  /**
   * Sets a custom cache repository instance.
   * 
   * @param {ICacheRepository} repository - The cache repository instance to set.
   * @throws {NoCacheRepositoryExceptions} - Throws an exception if the cache repository instance is not provided.
   */
  public setCustomRepository<Adapter extends AdaptersEnum, Client = any>(repository: ICacheRepository<Adapter, Client>) {
    if (!repository) throw new NoCacheRepositoryExceptions();
    getMetadataArgsStorage().setCacheRepository(repository)
  }
}
