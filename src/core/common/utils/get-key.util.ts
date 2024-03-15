import { NoCacheKeyExceptions } from "@core/exceptions";

type Input<I = any, O = any> = {
  input: I;
  output?: O;
  key?: string;
  custom_key?: (input: I, output?: O) => string | Promise<string>;
}

export async function getKey<I = any, O = any>({ key, custom_key, input, output }: Input<I, O>): Promise<string> {
  if (custom_key) {
    return await custom_key(input, output)
  }

  if (key) return key

  throw new NoCacheKeyExceptions("No keys for cache was provided");
}