import { CacheRetrieve, CacheSave } from "@core/common";
import { createHashedKey } from "@core/utils/create-hash.util";
import { randomUUID } from "crypto";

export const KEY = randomUUID();
export const ID = randomUUID();

type Input = {
  page: number;
  per_page: number;
}

type Output = {
  page: number;
  per_page: number;
  id: string;
}

export class Mock {
  @CacheSave<Input, Output[]>({
    key: (input, output) => {
      const key = `${KEY}/${createHashedKey(input)}`;
      return key;
    }
  })
  async save(input: Input): Promise<Output[]> {
    return [
      {
        ...input,
        id: ID
      }
    ]
  }

  @CacheRetrieve<Input>({ key: (input) => `${KEY}/${createHashedKey(input)}}` })
  async get(input: Input): Promise<Output[]> {
    return [
      {
        ...input,
        id: ID
      }
    ]
  }
}