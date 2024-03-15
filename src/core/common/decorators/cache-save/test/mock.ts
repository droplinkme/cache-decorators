import { randomUUID } from "crypto";
import { CacheSave } from "../cache-save.decorator";

export const MOCK_KEY = randomUUID()
export const OUTPUT_KEY = randomUUID()
export const MOCK_TTL = 10

export type Input = {
  id: string
}

export type Output = {
  id: string;
  key: string;
  success: boolean
}

export class Mock {
  @CacheSave({ key: MOCK_KEY })
  async onlyKey(input: Input): Promise<Output> {
    return { ...input, key: OUTPUT_KEY, success: true };
  }

  @CacheSave({ key: MOCK_KEY, ttl: MOCK_TTL })
  async keyAndTtl(input: Input): Promise<Output> {
    return { ...input, key: OUTPUT_KEY, success: true };
  }

  @CacheSave<Input, Output>({
    custom_key: (input, output) => {
      return `${MOCK_KEY}/${input.id}/${(output as Output).key}`
    }
  })
  async withCustomKey(input: Input): Promise<Output> {
    return { ...input, key: OUTPUT_KEY, success: true };
  }
}