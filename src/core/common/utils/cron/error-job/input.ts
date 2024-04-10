import { LockInput } from "@core/common/types"

export type Input = {
  err: any,
  cron_id: string
  running: boolean
  setLocked: (ttl: number) => Promise<void>
  lock: LockInput
}