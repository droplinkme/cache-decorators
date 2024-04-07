export type RetrieveOrSaveActionInput<T = any> = {
  key: string;
  fn: () => Promise<T>;
  ttl?: number;
  no_cache?: boolean;
  fallback?: boolean;
}