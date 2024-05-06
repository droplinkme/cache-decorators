import { randomUUID } from "crypto";
import { CacheResponse } from "../cache-response.decorator";

export const MOCK_KEY = randomUUID()
export const OUTPUT_KEY = randomUUID()
export const MOCK_TTL = 10

export type Param = {
  id: string
}

export type Body = {
  name: string
}


export type Output = {
  id: string;
  name: string;
  key: string;
  success: boolean
}

export class Mock {
  @CacheResponse({ key: MOCK_KEY })
  async onlyKey(param: Param, body: Body): Promise<Output> {
    return { ...param, ...body, key: OUTPUT_KEY, success: true };
  }

  @CacheResponse({ key: MOCK_KEY, hashable_key: true })
  async onlyHashableKey(param: Param, body: Body): Promise<Output> {
    return { ...param, ...body, key: OUTPUT_KEY, success: true };
  }


  @CacheResponse({ key: MOCK_KEY, ttl: MOCK_TTL })
  async keyAndTtl(param: Param, body: Body): Promise<Output> {
    return { ...param, ...body, key: OUTPUT_KEY, success: true };
  }

  @CacheResponse({ key: MOCK_KEY, ttl: MOCK_TTL, no_cache: true })
  async keyAndTtlAndNoCache(input: Param, body: Body): Promise<Output> {
    return { ...input, ...body, key: OUTPUT_KEY, success: true };
  }

  @CacheResponse<[Param, Body]>({
    key: (input) => {
      const [{ id }, { name }] = input;
      return `${MOCK_KEY}/${id}/${name}`
    }
  })
  async withCustomKey(param: Param, body: Body): Promise<Output> {
    return { ...param, ...body, key: OUTPUT_KEY, success: true };
  }
}