import { randomUUID } from "crypto";
import { CacheInvalidate } from "../cache-invalidate.decorator";

export const MOCK_KEY = randomUUID()

export type Input = {
  id: string
}

export type Output = {
  id: string;
  success: boolean
}

export class Mock {
  @CacheInvalidate({ key: MOCK_KEY })
  async onlyKey(input: Input): Promise<Output> {
    return { ...input, success: true };
  }

  @CacheInvalidate<Input>({ custom_key: (input) => `${MOCK_KEY}/${input.id}` })
  async withCustomKey(input: Input): Promise<Output> {
    return { ...input, success: true };
  }
}