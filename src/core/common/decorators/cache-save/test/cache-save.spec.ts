import { DataSource } from "@database/datasource"
import { Input, MOCK_KEY, MOCK_TTL, Mock, OUTPUT_KEY, Output } from "./mock"
import { FakeCacheRepository } from "@database/fake/repository.fake"
import { randomUUID } from "crypto"

describe('#CacheSave', () => {
  DataSource.setCustomRepository(new FakeCacheRepository());
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