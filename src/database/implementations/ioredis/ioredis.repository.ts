import { createHash } from 'crypto';
import { ConnectionExceptions } from '@core/exceptions';
import { ICacheRepository } from '@database/interfaces';
import { IORedisResource } from './ioredis.resource';
import { Save } from './methods/save.method';
import { Retrieve } from './methods/retrieve.method';
import { Remove } from './methods/remove.method';
import { RetrieveOrSave } from './methods/retrieve-or-save';
import { RemoveByPrefix } from './methods/remove-by-prefix.method';
import { Invalidate } from './methods/invalidate.method';
import { FlushAll } from './methods/flush-all.method';
import { RetrieveByPattern } from './methods/retrieve-by-patter.method';

export class IORedisCacheRepository extends IORedisResource implements ICacheRepository {
  public save = new Save(this).execute;
  public retrieve = new Retrieve(this).execute;
  public remove = new Remove(this).execute;
  public invalidate = new Invalidate(this).execute;
  public flushAll = new FlushAll(this).execute;
  public retrieveByPattern = new RetrieveByPattern(this).execute;
  public removeByPrefix = new RemoveByPrefix(this).execute;
  public retrieveOrSave = new RetrieveOrSave(this).execute;
}
