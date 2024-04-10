export type LoggerInput = {
  logger?: (value: string) => void;
  error?: (err: any) => void;
}