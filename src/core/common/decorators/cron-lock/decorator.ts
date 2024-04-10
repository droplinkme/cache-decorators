import { CronAction, LockInput } from "@core/common/types";
import { Input } from "./input";
import { camelCaseSlugfy } from "@core/utils";
import { DataSource } from "@database/datasource";
import { finishJob, isCronLocked, isCronRunning, setRunningJob } from "@core/common/utils/cron";
import { errorJob } from "@core/common/utils/cron/error-job/util";
import { createCronLockDecorator } from "../create-cron-lock-decorator";

export function CronLock(input: Input): MethodDecorator {
  const action: CronAction<any> = async ({ method, instance, args, name, running, cron_id, setLocked, getLocked }) => {
    const output = await method.apply(instance, args);
    const key = input.key ?? camelCaseSlugfy(name);
    const connection = DataSource.getRepository();

    const cron = await getLocked(connection, key)
    const is_locked = isCronLocked({ cron, cron_id, logger: { logger: input.logger } });
    const is_running = isCronRunning({ running, cron_id, logger: { logger: input.logger } });
    if (is_locked || is_running) return;

    const lock: LockInput = {
      logger: input.logger,
      lock_ttl: input.lock_ttl,
      release_ttl: input.release_ttl,
      error: input.error
    }

    try {
      await setRunningJob({
        running,
        setLocked: setLocked(connection, key, cron_id),
        cron_id,
        lock
      })
      await method.apply(args);
    } catch (err: any) {
      await errorJob({
        err,
        cron_id,
        setLocked: setLocked(connection, key, cron_id),
        lock,
        running
      })
    } finally {
      await finishJob({
        running,
        cron_id,
        setLocked: setLocked(connection, key, cron_id),
        lock,

      })
    }

    return output;
  };
  return createCronLockDecorator<any, any>(action);
}
