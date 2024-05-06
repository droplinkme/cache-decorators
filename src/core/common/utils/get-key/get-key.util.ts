import { NoCacheKeyExceptions } from "@core/exceptions/no-cache-key.exception";
import { Input as DefaultInput } from "../../types";
import { Input } from "./input";

export async function getKey<I = any, O = any>({ key, input, output, original_args }: Input<I[], O> & DefaultInput<I, O>): Promise<string> {
  switch (typeof key) {
    case 'string':
      return key;
    case
      'function':
      return original_args
        ? await key(input as unknown as any, output)
        : await key(input[0], output)
    default:
      throw new NoCacheKeyExceptions("No keys for cache was provided");
  }
}