import { LockInput } from "@core/common/types"

export type Input = {
  cron_id: string
  running: boolean
  setLocked: (ttl: number) => Promise<void>
  lock: LockInput
}