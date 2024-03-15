import { randomUUID } from "crypto";
import { CacheRetrieve } from "../cache-retrieve.decorator";

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
  @CacheRetrieve({ key: MOCK_KEY })
  async onlyKey(input: Input): Promise<Output> {
    return { ...input, key: OUTPUT_KEY, success: true };
  }

  @CacheRetrieve({ key: MOCK_KEY, ttl: MOCK_TTL })
  async keyAndTtl(input: Input): Promise<Output> {
    return { ...input, key: OUTPUT_KEY, success: true };
  }

  @CacheRetrieve({ key: MOCK_KEY, ttl: MOCK_TTL, no_cache: true })
  async keyAndTtlAndNoCache(input: Input): Promise<Output> {
    return { ...input, key: OUTPUT_KEY, success: true };
  }

  @CacheRetrieve<Input>({
    custom_key: (input) => {
      return `${MOCK_KEY}/${input.id}`
    }
  })
  async withCustomKey(input: Input): Promise<Output> {
    return { ...input, key: OUTPUT_KEY, success: true };
  }
}