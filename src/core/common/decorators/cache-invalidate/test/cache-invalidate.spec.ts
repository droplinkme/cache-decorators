import { DataSource } from "@database/datasource"
import { Input, MOCK_KEY, Mock, Output } from "./mock"
import { FakeCacheRepository } from "@database/fake/repository.fake"
import { randomUUID } from "crypto"

describe('#CacheInvalidate', () => {
  const dataSource = new DataSource();
  dataSource.setCustomRepository(new FakeCacheRepository());
  const repository = dataSource.getRepository();
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
        expect(repository.invalidate).toHaveBeenCalledWith(MOCK_KEY)
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
        expect(repository.invalidate).toHaveBeenCalledWith(custom_key)
        expect(output).toEqual({
          ...input, success: true
        })
      }
    }
  ])('$should', async ({ expected, fn }) => {
    await expected(fn)
  })
})