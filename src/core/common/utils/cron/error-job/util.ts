import { setJobStatus } from "../set-job-status";
import { Input } from "./input";

export const errorJob = async ({ running, setLocked, lock, cron_id, err }: Input) => {
  await setJobStatus({
    running,
    setLocked,
    ttl: lock.release_ttl ?? 60,
    message: `ID [${cron_id}] | JOB:ERROR ${err}`,
    logger: lock
  });
};