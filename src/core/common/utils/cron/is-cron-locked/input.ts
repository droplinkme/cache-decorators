import { CronInput, LoggerInput } from "@core/common/types"

export type Input = {
  cron_id: string,
  cron?: CronInput
  logger: LoggerInput
}