import { randomUUID } from "crypto";
import { CacheRemoveByPrefix } from "../cache-remove-by-prefix.decorator";

export const MOCK_KEY = randomUUID()

export type Input = {
  id: string
}

export type Output = {
  id: string;
  success: boolean
}

export class Mock {
  @CacheRemoveByPrefix({ key: MOCK_KEY })
  async onlyKey(input: Input): Promise<Output> {
    return { ...input, success: true };
  }

  @CacheRemoveByPrefix({ key: MOCK_KEY, fallback: true })
  async onlyKeyAndFallback(input: Input): Promise<Output> {
    return { ...input, success: true };
  }

  @CacheRemoveByPrefix({ key: MOCK_KEY, hashable_key: true })
  async onlyHashableKey(input: Input): Promise<Output> {
    return { ...input, success: true };
  }

  @CacheRemoveByPrefix<Input>({ key: (input) => `${MOCK_KEY}/${input.id}` })
  async withCustomKey(input: Input): Promise<Output> {
    return { ...input, success: true };
  }
}