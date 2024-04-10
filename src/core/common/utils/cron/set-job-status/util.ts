import { log } from "../log";
import { Input } from "./input";

export const setJobStatus = async ({ setLocked, running, ttl, message, logger }: Input) => {
  await setLocked(ttl);
  running = !running;
  log(logger, message);
};
