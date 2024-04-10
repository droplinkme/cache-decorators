export type Input = {
  key?: string;
  lock_ttl?: number;
  release_ttl?: number;
  logger?: (value: string) => void
  error?: (err: any) => void
}