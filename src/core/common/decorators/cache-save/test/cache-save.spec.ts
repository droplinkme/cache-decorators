import { DataSource } from "@database/datasource"
import { Input, MOCK_KEY, MOCK_TTL, Mock, OUTPUT_KEY, Output } from "./mock"
import { VitestFakeCacheRepository } from "@database/fake"
import { randomUUID } from "crypto"
import { createHashedKey } from "@core/utils/create-hash.util"
import { describe, it, expect } from 'vitest'

describe('#CacheSave', () => {
  DataSource.setCustomRepository(new VitestFakeCacheRepository());
  const repository = DataSource.getRepository();
  const mock = new Mock()

  const input: Input = {
    id: randomUUID()
  }

  it.each([
    {
      should: 'Save value succesfuly',
      fn: mock.onlyKey,
      expected: async (fn: (input: Input) => Promise<Output>) => {
        const output = await fn(input)
        expect(repository.save).toHaveBeenCalledWith({ key: MOCK_KEY, value: output, ttl: undefined })
        expect(output).toEqual({
          ...input, key: OUTPUT_KEY, success: true
        })
      }
    },
    {
      should: 'Save value succesfuly with hashable key',
      fn: mock.onlyHashableKey,
      expected: async (fn: (input: Input) => Promise<Output>) => {
        const output = await fn(input)
        expect(repository.save).toHaveBeenCalledWith({ key: createHashedKey(MOCK_KEY), value: output, ttl: undefined })
        expect(output).toEqual({
          ...input, key: OUTPUT_KEY, success: true
        })
      }
    },
    {
      should: 'Save value with ttl succesfuly',
      fn: mock.keyAndTtl,
      expected: async (fn: (input: Input) => Promise<Output>) => {
        const output = await fn(input)
        expect(repository.save).toHaveBeenCalledWith({ key: MOCK_KEY, value: output, ttl: MOCK_TTL })
        expect(output).toEqual({
          ...input, key: OUTPUT_KEY, success: true
        })
      }
    },
    {
      should: 'Save value with custom key succesfuly',
      fn: mock.withCustomKey,
      expected: async (fn: (input: Input) => Promise<Output>) => {
        const output = await fn(input)
        const custom_key = `${MOCK_KEY}/${input.id}/${output.key}`;
        expect(repository.save).toHaveBeenCalledWith({ key: custom_key, value: output, ttl: undefined })
        expect(output).toEqual({
          ...input, key: OUTPUT_KEY, success: true
        })
      }
    }
  ])('$should', async ({ expected, fn }) => {
    await expected(fn)
  })
})