import { log } from "../log";
import { Input } from "./input";

export const isCronRunning = ({ cron_id, logger, running }: Input) => {
  if (running) {
    log(logger, `ID [${cron_id}] | JOB:RUNNING`);
    return true;
  }
  return false;
};
