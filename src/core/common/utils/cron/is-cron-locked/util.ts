import { log } from "../log";
import { Input } from "./input";

export const isCronLocked = ({ cron, cron_id, logger }: Input) => {
  if (cron && cron.id !== cron_id) {
    log(logger, `ID [${cron_id}] | CRON:LOCKED: ${cron.id}`);
    return true;
  }
  return false;
};
