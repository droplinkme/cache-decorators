import { LoggerInput } from "@core/common/types";

export type Input = {
  running: boolean;
  setLocked: (ttl: number) => Promise<void>;
  ttl: number;
  message: string;
  logger: LoggerInput
}