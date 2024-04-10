import { LoggerInput } from "@core/common/types";

export const logError = (input: LoggerInput, message: string) => {
  if (input.logger) {
    input.logger(message);
  }
  if (input.error) {
    input.error(message);
  }
};
