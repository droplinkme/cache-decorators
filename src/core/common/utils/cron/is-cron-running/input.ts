import { CronInput, LoggerInput } from "@core/common/types"

export type Input = {
  cron_id: string,
  running: boolean
  logger: LoggerInput
}