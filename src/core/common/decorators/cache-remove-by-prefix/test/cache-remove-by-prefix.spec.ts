import { DataSource } from "@database/datasource"
import { Input, MOCK_KEY, Mock, Output } from "./mock"
import { FakeCacheRepository } from "@database/fake/repository.fake"
import { randomUUID } from "crypto"
import { createHashedKey } from "@core/utils/create-hash.util"

describe('#CacheRemoveByPrefix', () => {
  DataSource.setCustomRepository(new FakeCacheRepository());
  const repository = DataSource.getRepository();
  const mock = new Mock()

  const input: Input = {
    id: randomUUID()
  }

  it.each([
    {
      should: 'Remove by prefix value succesfuly',
      fn: mock.onlyKey,
      expected: async (fn: (input: Input) => Promise<Output>) => {
        const output = await fn(input)
        expect(repository.removeByPrefix).toHaveBeenCalledWith({ prefix: MOCK_KEY })
        expect(output).toEqual({
          ...input, success: true
        })
      }
    },
    {
      should: 'Remove by prefix value with hashable key succesfuly',
      fn: mock.onlyHashableKey,
      expected: async (fn: (input: Input) => Promise<Output>) => {
        const output = await fn(input)
        expect(repository.removeByPrefix).toHaveBeenCalledWith({ prefix: createHashedKey(MOCK_KEY) })
        expect(output).toEqual({
          ...input, success: true
        })
      }
    },
    {
      should: 'Remove by prefix value with custom key succesfuly',
      fn: mock.withCustomKey,
      expected: async (fn: (input: Input) => Promise<Output>) => {
        const output = await fn(input)
        const custom_key = `${MOCK_KEY}/${input.id}`;
        expect(repository.removeByPrefix).toHaveBeenCalledWith({ prefix: custom_key })
        expect(output).toEqual({
          ...input, success: true
        })
      }
    }
  ])('$should', async ({ expected, fn }) => {
    await expected(fn)
  })
})