import { DataSource } from "@database/datasource"
import { Input, MOCK_KEY, MOCK_TTL, Mock, OUTPUT_KEY, Output } from "./mock"
import { FakeCacheRepository } from "@database/fake/repository.fake"
import { randomUUID } from "crypto"

describe('#CacheRetrieve', () => {
  const dataSource = new DataSource();
  dataSource.setCustomRepository(new FakeCacheRepository());
  const repository = dataSource.getRepository();
  const mock = new Mock()

  let retrieveOrSave: any;

  beforeEach(() => {
    retrieveOrSave = jest.spyOn(repository, 'retrieveOrSave');
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
        expect(retrieveOrSave).toHaveBeenCalledWith(MOCK_KEY, expect.any(Function), undefined, undefined)
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
        expect(retrieveOrSave).toHaveBeenCalledWith(MOCK_KEY, expect.any(Function), MOCK_TTL, undefined)
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
        expect(retrieveOrSave).toHaveBeenCalledWith(MOCK_KEY, expect.any(Function), MOCK_TTL, true)
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
        expect(retrieveOrSave).toHaveBeenCalledWith(custom_key, expect.any(Function), undefined, undefined)
        expect(output).toEqual({
          ...input, key: OUTPUT_KEY, success: true
        })
      }
    }
  ])('$should', async ({ expected, fn }) => {
    await expected(fn)
  })
})