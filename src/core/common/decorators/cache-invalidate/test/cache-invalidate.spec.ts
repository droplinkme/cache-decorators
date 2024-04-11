import { DataSource } from "@database/datasource"
import { Input, MOCK_KEY, Mock, Output } from "./mock"
import { randomUUID } from "crypto"
import { createHashedKey } from "@core/utils/create-hash.util"
import { VitestFakeCacheRepository } from "@database/fake"
import { describe, it, expect } from 'vitest'

describe('#CacheInvalidate', () => {
  DataSource.setCustomRepository(new VitestFakeCacheRepository());
  const repository = DataSource.getRepository();
  const mock = new Mock()

  const input: Input = {
    id: randomUUID()
  }

  it.each([
    {
      should: 'Invalidate value succesfuly',
      fn: mock.onlyKey,
      expected: async (fn: (input: Input) => Promise<Output>) => {
        const output = await fn(input)
        expect(repository.invalidate).toHaveBeenCalledWith({ key: MOCK_KEY })
        expect(output).toEqual({
          ...input, success: true
        })
      }
    },
    {
      should: 'Invalidate value with hashable key succesfuly',
      fn: mock.onlyHashableKey,
      expected: async (fn: (input: Input) => Promise<Output>) => {
        const output = await fn(input)
        expect(repository.invalidate).toHaveBeenCalledWith({ key: createHashedKey(MOCK_KEY) })
        expect(output).toEqual({
          ...input, success: true
        })
      }
    },
    {
      should: 'Invalidate value with custom key succesfuly',
      fn: mock.withCustomKey,
      expected: async (fn: (input: Input) => Promise<Output>) => {
        const output = await fn(input)
        const custom_key = `${MOCK_KEY}/${input.id}`;
        expect(repository.invalidate).toHaveBeenCalledWith({ key: custom_key })
        expect(output).toEqual({
          ...input, success: true
        })
      }
    }
  ])('$should', async ({ expected, fn }) => {
    await expected(fn)
  })
})