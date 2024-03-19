import { ICacheRepository } from "./interfaces";
import { getMetadataArgsStorage } from "@core/global/globals";
import { NoCacheRepositoryExceptions } from "@core/exceptions";
import { DataSourceOptions } from "./types";
import { AdaptersEnum } from "./enums";
import { DataSourceAdapterMap } from "./adapters";

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
  public static async initialize<Adapter extends AdaptersEnum = any, Client = any>(adapter: Adapter, options: DataSourceOptions<Adapter>): Promise<ICacheRepository<Adapter, Client>> {
    const Repository = DataSourceAdapterMap<Adapter, Client>().get(adapter);

    if (!Repository) {
      throw new NoCacheRepositoryExceptions("No cache adapter found.");
    }

    const repository = new Repository();
    await repository.connect({
      ...options,
      logger: options.logger ?? console.log
    })
    getMetadataArgsStorage().setCacheRepository(repository)
    return repository
  }

  /**
   * Retrieves the cache repository instance.
   * 
   * @returns {ICacheRepository} - The cache repository instance.
   * @throws {NoCacheRepositoryExceptions} - Throws an exception if the cache repository instance is not found.
   */
  public static getRepository<Adapter extends AdaptersEnum, Client = any>(): ICacheRepository<Adapter, Client> {
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
  public static setCustomRepository<Adapter extends AdaptersEnum, Client = any>(repository: ICacheRepository<Adapter, Client>) {
    if (!repository) throw new NoCacheRepositoryExceptions();
    getMetadataArgsStorage().setCacheRepository(repository)
  }
}
