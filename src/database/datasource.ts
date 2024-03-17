import { ICacheRepository } from "./interfaces";
import { Adapter } from "./adapters";
import { getMetadataArgsStorage } from "@core/global/globals";
import { NoCacheRepositoryExceptions } from "@core/exceptions";
import { DataSourceOptions } from "./types";

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
  async initialize<T extends keyof typeof Adapter>(options: DataSourceOptions<T>): Promise<ICacheRepository> {
    const Repository = Adapter[options.adapter];
    await Repository.connect(options)
    const repository = new Repository();
    getMetadataArgsStorage().setCacheRepository(repository)
    return repository
  }

  /**
   * Retrieves the cache repository instance.
   * 
   * @returns {ICacheRepository} - The cache repository instance.
   * @throws {NoCacheRepositoryExceptions} - Throws an exception if the cache repository instance is not found.
   */
  public getRepository(): ICacheRepository {
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
  public setCustomRepository(repository: ICacheRepository) {
    if (!repository) throw new NoCacheRepositoryExceptions();
    getMetadataArgsStorage().setCacheRepository(repository)
  }
}