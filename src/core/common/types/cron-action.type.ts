import { ICacheRepository } from "@database/interfaces";

type SetLockedFunction = (ttl: number) => Promise<void>;

type GetLockedFunction = (connection: ICacheRepository, key: string) => Promise<{ id: string } | undefined>;

type Args<I = any> = {
  cron_id: string;
  instance: unknown;
  method: Function;
  args: I[];
  name: string;
  running: boolean;
  setLocked: (connection: ICacheRepository, key: string, cron_id: string) => SetLockedFunction;
  getLocked: GetLockedFunction;
}
export type CronAction<I = any, O = any> = (args: Args<I>) => Promise<O | undefined>