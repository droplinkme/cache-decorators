import { LoggerInput } from "@core/common/types";

export const log = (input: LoggerInput, message: string) => {
  if (input.logger) {
    input.logger(message);
  }
};