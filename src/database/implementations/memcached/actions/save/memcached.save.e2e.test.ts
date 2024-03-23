import { AdaptersEnum } from "@database/enums"
import { ICacheRepository, SaveActionInput } from "@database/index"
import 'dotenv/config';
import { disconnectTestRepository, initializeTestRepository } from "@database/fake/initialize";
import { randomUUID } from "crypto";
import { SaveAction } from "./action";
import Memcached from "memcached";

describe('MEMCACHED SAVE ACTION', () => {
  let repository: ICacheRepository<AdaptersEnum.MEMCACHED, Memcached>;

  beforeAll(async () => {
    repository = await initializeTestRepository(AdaptersEnum.MEMCACHED, {
      location: `${process.env.MEMCACHED_HOST}:${process.env.MEMCACHED_PORT}`,
    })
  })

  afterAll(async () => {
    await disconnectTestRepository(repository);
  })

  let action: SaveAction
  beforeEach(async () => {
    action = new SaveAction(repository);
  })

  const value = { id: randomUUID() };

  const input: SaveActionInput<typeof value> = {
    key: randomUUID(),
    value,
    ttl: 60
  }

  const output = {
    ...value,
  }

  it.each([
    {
      should: 'Should save cache successfuly in Memcached without ttl',
      input: { ...input, ttl: undefined },
      setup: async () => { },
      expected: async (result: any) => {
        expect(result).toStrictEqual(output)
        const cache = await repository.retrieve({ key: input.key });
        expect(cache).toStrictEqual(result);
      }
    },
    {
      should: 'Should save cache successfuly in Memcached with ttl',
      input,
      setup: async () => { },
      expected: async (result: any) => {
        expect(result).toStrictEqual(output)
        const cache = await repository.retrieve({ key: input.key });
        expect(cache).toStrictEqual(result);
      }
    },
  ])('$should', async ({ expected, input, setup }) => {
    if (setup) await setup();
    return action.execute<typeof value>(input).then(expected).catch(expected);
  })
})