import { randomUUID } from "crypto";
import { CacheRemove } from "../cache-remove.decorator";

export const MOCK_KEY = randomUUID()

export type Input = {
  id: string
}

export type Output = {
  id: string;
  success: boolean
}

export class Mock {
  @CacheRemove({ key: MOCK_KEY })
  async onlyKey(input: Input): Promise<Output> {
    return { ...input, success: true };
  }

  @CacheRemove({ key: MOCK_KEY, hashable_key: true })
  async onlyHashableKey(input: Input): Promise<Output> {
    return { ...input, success: true };
  }

  @CacheRemove<Input>({ key: (input) => `${MOCK_KEY}/${input.id}` })
  async withCustomKey(input: Input): Promise<Output> {
    return { ...input, success: true };
  }
}