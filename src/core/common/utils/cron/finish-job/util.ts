import { setJobStatus } from "../set-job-status";
import { Input } from "./input";

export const finishJob = async ({ running, setLocked, lock, cron_id }: Input) => {
  await setJobStatus({
    running,
    setLocked,
    ttl: lock.release_ttl ?? 60,
    message: `ID [${cron_id}] | JOB:FINISH`,
    logger: lock
  });
};