export abstract class IORedisAdapterOptions {
  host!: string;
  port?: number
  timeout?: number
  password?: string
  commandTimeout?: number;
  retryStrategy?: (times: number) => number | void | null
  reconnectOnError?: (err: any) => boolean;
  maxRetries?: number;
}