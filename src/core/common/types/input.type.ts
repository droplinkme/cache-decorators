import { Key } from "./key.type";

export type Input<I = any, O = any> = {
  no_cache?: boolean;
  ttl?: number;
  key: Key<I, O>;
}