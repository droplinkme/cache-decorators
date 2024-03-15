import { ICacheRepository } from "./interfaces";
import { adapter } from "./adapter";
import { getMetadataArgsStorage } from "@core/global/globals";
import { DataSourceOptions } from "@core/types";
import { NoCacheRepositoryExceptions } from "@core/exceptions";

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
  async initialize(options: DataSourceOptions): Promise<ICacheRepository> {
    const Datasource = adapter[options.adpter ?? 'ioredis']();
    await Datasource.connect(options)
    const instace = new Datasource();
    getMetadataArgsStorage().setCacheRepository(instace)
    return instace
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
  public setRepository(repository: ICacheRepository) {
    if (!repository) throw new NoCacheRepositoryExceptions();
    getMetadataArgsStorage().setCacheRepository(repository)
  }
}