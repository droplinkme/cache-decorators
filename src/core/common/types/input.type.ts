export type Input<I = any, O = any> = {
  no_cache?: boolean;
  ttl?: number;
  key?: string;
  custom_key?: (input: I, output?: O) => string | Promise<string>;
}