import { ICacheRepository } from '@database/interfaces';
import { RedisResource } from './redis.resource';
import { AdaptersEnum } from '@database/enums';
import { Redis } from 'ioredis';
import {
  FlushAllAction,
  InvalidateAction,
  RemoveAction,
  RemoveByPrefixAction,
  RetrieveByPatternAction,
  RetrieveOrSaveAction,
  SaveAction,
} from './actions';
import { RetrieveAction } from './actions/retrieve';
import {
  InvalidateActionInput,
  RemoveActionInput,
  RemoveByPrefixActionInput,
  RetrieveActionInput,
  RetrieveByPatternActionInput,
  RetrieveOrSaveActionInput,
  SaveActionInput
} from '@database/types';


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

  public save<T = any>(input: SaveActionInput<T>): Promise<T> {
    return this.saveAction.execute<T>(input);
  }
  public retrieveOrSave<T = any>(input: RetrieveOrSaveActionInput<T>): Promise<T | undefined> {
    return this.retrieveOrSaveAction.execute<T>(input);
  }
  public retrieve<T = any>(input: RetrieveActionInput): Promise<T | undefined> {
    return this.retrieveAction.execute<T>(input);
  }
  public async retrieveByPattern<T = any[]>(input: RetrieveByPatternActionInput): Promise<T[]> {
    return await this.retrieveByPatternAction.execute<T[]>(input)
  }
  public async remove(input: RemoveActionInput): Promise<void> {
    await this.removeAction.execute(input);
  }
  public async removeByPrefix(input: RemoveByPrefixActionInput): Promise<void> {
    await this.removeByPrefixAction.execute(input);
  }
  public async flushAll(): Promise<void> {
    await this.flushAllAction.execute()
  }
  public async invalidate(input: InvalidateActionInput): Promise<void> {
    await this.invalidateAction.execute(input);
  }
}
