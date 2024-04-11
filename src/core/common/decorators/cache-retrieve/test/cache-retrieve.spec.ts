import { DataSource } from "@database/datasource"
import { Input, MOCK_KEY, MOCK_TTL, Mock, OUTPUT_KEY, Output } from "./mock"
import { VitestFakeCacheRepository } from "@database/fake"
import { randomUUID } from "crypto"
import { createHashedKey } from "@core/utils/create-hash.util"
import { describe, beforeEach, it, expect, vi, MockInstance } from 'vitest'

describe('#CacheRetrieve', () => {
  DataSource.setCustomRepository(new VitestFakeCacheRepository());
  const repository = DataSource.getRepository();
  const mock = new Mock()

  let retrieveOrSave: MockInstance;

  beforeEach(() => {
    retrieveOrSave = vi.spyOn(repository, 'retrieveOrSave');
  })

  const input: Input = {
    id: randomUUID()
  }

  it.each([
    {
      should: 'Retrieve value succesfuly',
      fn: mock.onlyKey,
      expected: async (fn: (input: Input) => Promise<Output>) => {
        const output = await fn(input)
        expect(retrieveOrSave).toHaveBeenCalledWith({
          key: MOCK_KEY,
          fn: expect.any(Function),
          ttl: undefined,
          no_cache: undefined
        })
        expect(output).toEqual({
          ...input, key: OUTPUT_KEY, success: true
        })
      }
    },
    {
      should: 'Retrieve value with hashable key succesfuly',
      fn: mock.onlyHashableKey,
      expected: async (fn: (input: Input) => Promise<Output>) => {
        const output = await fn(input)
        expect(retrieveOrSave).toHaveBeenCalledWith({
          key: createHashedKey(MOCK_KEY),
          fn: expect.any(Function),
          ttl: undefined,
          no_cache: undefined
        })
        expect(output).toEqual({
          ...input, key: OUTPUT_KEY, success: true
        })
      }
    },
    {
      should: 'Retrieve value with ttl succesfuly',
      fn: mock.keyAndTtl,
      expected: async (fn: (input: Input) => Promise<Output>) => {
        const output = await fn(input)
        expect(retrieveOrSave).toHaveBeenCalledWith({
          key: MOCK_KEY,
          fn: expect.any(Function),
          ttl: MOCK_TTL,
          no_cache: undefined
        })
        expect(output).toEqual({
          ...input, key: OUTPUT_KEY, success: true
        })
      }
    },
    {
      should: 'Retrieve value with ttl and no_cache succesfuly',
      fn: mock.keyAndTtlAndNoCache,
      expected: async (fn: (input: Input) => Promise<Output>) => {
        const output = await fn(input)
        expect(retrieveOrSave).toHaveBeenCalledWith({
          key: MOCK_KEY,
          fn: expect.any(Function),
          ttl: MOCK_TTL,
          no_cache: true
        })
        expect(output).toEqual({
          ...input, key: OUTPUT_KEY, success: true
        })
      }
    },
    {
      should: 'Retrieve value with custom key succesfuly',
      fn: mock.withCustomKey,
      expected: async (fn: (input: Input) => Promise<Output>) => {
        const output = await fn(input)
        const custom_key = `${MOCK_KEY}/${input.id}`;
        expect(retrieveOrSave).toHaveBeenCalledWith({
          key: custom_key,
          fn: expect.any(Function),
          ttl: undefined,
          no_cache: undefined
        })
        expect(output).toEqual({
          ...input, key: OUTPUT_KEY, success: true
        })
      }
    }
  ])('$should', async ({ expected, fn }) => {
    await expected(fn)
  })
})