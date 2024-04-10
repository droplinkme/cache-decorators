import { CronAction } from "@core/common/types";
import { ICacheRepository } from "@database/interfaces";
import { randomUUID } from "crypto";


export function createCronLockDecorator<I = any, O = any>(action: CronAction<I>): MethodDecorator {
  const setLocked = (connection: ICacheRepository, key: string, cron_id: string) => {
    return async (ttl: number) => {
      await connection.save({ key, value: { id: cron_id }, ttl });
    }
  }

  const getLocked = async (connection: ICacheRepository, key: string) => {
    return await connection.retrieve<{ id: string }>({ key });
  }
  return function (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> | void {
    const method = descriptor.value as Function;
    const name = target.constructor.name
    const cron_id = randomUUID()
    let running = false;
    descriptor.value = async function (this: unknown, ...args: I[]): Promise<O | undefined> {
      return action({
        running,
        cron_id,
        method,
        instance: this,
        name,
        args,
        setLocked,
        getLocked
      })
    } as unknown as TypedPropertyDescriptor<any>;
    return descriptor;
  };
}
