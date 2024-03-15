import { DataSource } from "@database/datasource"
import { Input, MOCK_KEY, MOCK_TTL, Mock, OUTPUT_KEY, Output } from "./mock"
import { FakeCacheRepository } from "@database/fake/repository.fake"
import { randomUUID } from "crypto"

describe('#CacheRetrieve', () => {
  const dataSource = new DataSource();
  dataSource.setRepository(new FakeCacheRepository());
  const repository = dataSource.getRepository();
  const mock = new Mock()

  let recoverOrSave: any;

  beforeEach(() => {
    recoverOrSave = jest.spyOn(repository, 'recoverOrSave');
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
        expect(recoverOrSave).toHaveBeenCalledWith(MOCK_KEY, expect.any(Function), undefined, undefined)
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
        expect(recoverOrSave).toHaveBeenCalledWith(MOCK_KEY, expect.any(Function), MOCK_TTL, undefined)
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
        expect(recoverOrSave).toHaveBeenCalledWith(MOCK_KEY, expect.any(Function), MOCK_TTL, true)
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
        expect(recoverOrSave).toHaveBeenCalledWith(custom_key, expect.any(Function), undefined, undefined)
        expect(output).toEqual({
          ...input, key: OUTPUT_KEY, success: true
        })
      }
    }
  ])('$should', async ({ expected, fn }) => {
    await expected(fn)
  })
})