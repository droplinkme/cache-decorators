import { ICacheRepository } from '@database/interfaces';
import { IORedisResource } from './ioredis.resource';
import { Save } from './methods/save.method';
import { Retrieve } from './methods/retrieve.method';
import { RetrieveOrSave } from './methods/retrieve-or-save';
import { FlushAll } from './methods/flush-all.method';
import { Redis } from 'ioredis';
import { AdaptersEnum } from '@database/enums';
import { Remove } from './methods/remove.method';
import { Invalidate } from './methods/invalidate.method';
import { RetrieveByPattern } from './methods/retrieve-by-patter.method';
import { RemoveByPrefix } from './methods/remove-by-prefix.method';

export class IORedisCacheRepository extends IORedisResource implements ICacheRepository<AdaptersEnum, Redis> {
  constructor() {
    super()
  }

  private readonly retrieveInstance = new Retrieve(this);
  private readonly removeByPrefixInstance = new RemoveByPrefix(this);
  private readonly retrieveByPatternInstance = new RetrieveByPattern(this);
  private readonly saveInstance = new Save(this);
  private readonly removeInstance = new Remove(this);
  private readonly invalidateInstance = new Invalidate(this);
  private readonly retrieveOrSaveInstance = new RetrieveOrSave(this);
  private readonly flushAllInstance = new FlushAll(this);

  public save<T = any>(key: string, value: T, ttl?: number | undefined): Promise<T> {
    return this.saveInstance.execute<T>(key, value, ttl);
  }
  public retrieve<T = any>(key: string): Promise<T | undefined> {
    return this.retrieveInstance.execute<T>(key);
  }
  public async remove(key: string): Promise<void> {
    await this.removeInstance.execute(key);
  }
  public async removeByPrefix(prefix: string): Promise<void> {
    await this.removeByPrefixInstance.execute(prefix);
  }
  public async flushAll(): Promise<void> {
    await this.flushAllInstance.execute();
  }
  public async retrieveByPattern<T = any>(pattern: string): Promise<T[]> {
    return await this.retrieveByPatternInstance.execute<T>(pattern)
  }
  public async invalidate(key: string): Promise<void> {
    await this.invalidateInstance.execute(key);
  }
  public retrieveOrSave<T = any>(key: string, fn: () => Promise<T>, ttl?: number | undefined, no_cache?: boolean | undefined): Promise<T | undefined> {
    return this.retrieveOrSaveInstance.execute<T>(key, fn, ttl, no_cache);
  }
}
