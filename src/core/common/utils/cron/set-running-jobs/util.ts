import { setJobStatus } from "../set-job-status";
import { Input } from "./input";

export const setRunningJob = async ({ running, setLocked, lock, cron_id }: Input) => {
  await setJobStatus({
    running,
    setLocked,
    ttl: lock.lock_ttl ?? 300,
    message: `ID [${cron_id}] | JOB:START`,
    logger: lock
  });
};