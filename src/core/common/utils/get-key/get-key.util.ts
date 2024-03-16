import { NoCacheKeyExceptions } from "@core/exceptions/no-cache-key.exception";
import { Input as DefaultInput } from "../../types";
import { Input } from "./input";

export async function getKey<I = any, O = any>({ key, input, output }: Input<I, O> & DefaultInput<I, O>): Promise<string> {
  switch (typeof key) {
    case 'string':
      return key;
    case
      'function':
      return await key(input, output)
    default:
      throw new NoCacheKeyExceptions("No keys for cache was provided");
  }
}