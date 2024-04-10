import { LoggerInput } from "./logger-input.type";

export type LockInput = LoggerInput & {
  lock_ttl?: number;
  release_ttl?: number;
}