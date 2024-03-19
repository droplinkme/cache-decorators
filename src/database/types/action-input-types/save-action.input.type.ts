export type SaveActionInput<T = any> = {
  key: string;
  value: T;
  ttl?: number;
}