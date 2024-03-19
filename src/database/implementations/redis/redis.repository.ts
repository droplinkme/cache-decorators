import { ICacheRepository } from '@database/interfaces';
import { RedisResource } from './redis.resource';
import { RetrieveAction } from './actions/retrieve.action';
import { RetrieveOrSaveAction } from './actions/retrieve-or-save.action';
import { AdaptersEnum } from '@database/enums';
import { Redis } from 'ioredis';
import { RetrieveByPatternAction } from './actions/retrieve-by-pattern.action';
import { FlushAllAction } from './actions/flush-all.action';
import { InvalidateAction } from './actions/invalidate.action';
import { RemoveByPrefixAction } from './actions/remove-by-prefix.action';
import { RemoveAction } from './actions/remove.action';
import { SaveAction } from './actions';


export class RedisCacheRepository extends RedisResource implements ICacheRepository<AdaptersEnum, Redis> {
  constructor() {
    super()
  }

  private readonly saveAction = new SaveAction(this);
  private readonly retrieveAction = new RetrieveAction(this);
  private readonly retrieveOrSaveAction = new RetrieveOrSaveAction(this);
  private readonly removeByPrefixAction = new RemoveByPrefixAction(this);
  private readonly retrieveByPatternAction = new RetrieveByPatternAction(this);
  private readonly removeAction = new RemoveAction(this);
  private readonly invalidateAction = new InvalidateAction(this);
  private readonly flushAllAction = new FlushAllAction(this);

  public save<T = any>(key: string, value: T, ttl?: number | undefined): Promise<T> {
    return this.saveAction.action<T>({ key, value, ttl });
  }
  public retrieveOrSave<T = any>(key: string, fn: () => Promise<T>, ttl?: number | undefined, no_cache?: boolean | undefined): Promise<T | undefined> {
    return this.retrieveOrSaveAction.action<T>(key, fn, ttl, no_cache);
  }
  public retrieve<T = any>(key: string): Promise<T | undefined> {
    return this.retrieveAction.action<T>(key);
  }
  public async retrieveByPattern<T = any[]>(pattern: string): Promise<T[]> {
    return await this.retrieveByPatternAction.action<T[]>(pattern)
  }
  public async remove(key: string): Promise<void> {
    await this.removeAction.action(key);
  }
  public async removeByPrefix(prefix: string): Promise<void> {
    await this.removeByPrefixAction.action(prefix);
  }
  public async flushAll(): Promise<void> {
    await this.flushAllAction.action()
  }
  public async invalidate(key: string): Promise<void> {
    await this.invalidateAction.action(key);
  }
}
