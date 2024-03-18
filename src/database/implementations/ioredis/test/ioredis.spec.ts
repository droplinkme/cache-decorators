import { AdaptersEnum } from "@database/enums"
import { ID, KEY, Mock } from "./mock"
import { DataSource, ICacheRepository } from "@database/index"
import { createHashedKey } from "@core/utils/create-hash.util";
import 'dotenv/config';

describe('Redis', () => {
  let repository: ICacheRepository<AdaptersEnum.REDIS, any>;

  beforeAll(async () => {
    const datasource = new DataSource();

    repository = await datasource.initialize<AdaptersEnum.REDIS>(AdaptersEnum.REDIS, {
      host: process.env.REDIS_HOST as string,
      port: Number(process.env.REDIS_PORT),
    });

    await new Promise((resolve) => {
      setTimeout(resolve, 100)
    })
  })

  afterAll(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 100)
    })
    await repository.flushAll()
    repository.disconnect();
  })

  beforeEach(async () => {
    await repository.flushAll()
  })

  const mock = new Mock();

  const input = {
    page: 0,
    per_page: 1
  }

  const output = {
    ...input,
    id: ID
  }

  it.each([
    {
      should: 'Should save cache successfuly in Redis',
      input,
      execute: mock.save,
      setup: async () => { },
      expected: async (result: any) => {
        expect(result).toStrictEqual([output])
        const key = `${KEY}/${createHashedKey(input)}`;
        const cache = await repository.retrieve(key);
        expect(cache).toStrictEqual(result);
      }
    },
    {
      should: 'Should retrieve cache successfuly in Redis',
      input,
      execute: mock.get,
      setup: async () => {
        const key = `${KEY}/${createHashedKey(input)}`;
        await repository.save(key, [output])
      },
      expected: async (result: any) => {
        expect(result).toStrictEqual([output])
        const key = `${KEY}/${createHashedKey(input)}`;
        const cache = await repository.retrieve(key);
        expect(cache).toStrictEqual(result);
      }
    }
  ])('$should', async ({ expected, execute, input, setup }) => {
    if (setup) await setup();
    return execute(input).then(expected).catch(expected);
  })
})