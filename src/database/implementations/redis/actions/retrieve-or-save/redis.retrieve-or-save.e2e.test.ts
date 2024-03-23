import { AdaptersEnum } from "@database/enums"
import { ICacheRepository, RetrieveOrSaveActionInput, SaveActionInput } from "@database/index"
import 'dotenv/config';
import { disconnectTestRepository, initializeTestRepository } from "@database/fake/initialize";
import { randomUUID } from "crypto";
import { Redis } from "ioredis";
import { RetrieveOrSaveAction } from "./action";

describe('REDIS RETRIEVE OR SAVE ACTION', () => {
  let repository: ICacheRepository<AdaptersEnum.REDIS, Redis>;
  let action: RetrieveOrSaveAction

  beforeAll(async () => {
    repository = await initializeTestRepository(AdaptersEnum.REDIS, {
      host: process.env.REDIS_HOST as string,
      port: Number(process.env.REDIS_PORT),
    })
  })

  afterAll(async () => {
    await disconnectTestRepository(repository);
  })

  beforeEach(async () => {
    action = new RetrieveOrSaveAction(repository);
  })

  const value = { id: randomUUID() };

  const fn = jest.fn(async () => {
    return value;
  });

  const input: RetrieveOrSaveActionInput<typeof value> = {
    key: randomUUID(),
    fn,
    ttl: 60,
    no_cache: false
  }

  const output = {
    ...value,
  }

  it.each([
    {
      should: 'Should return from cache successfuly in Redis without ttl',
      input,
      setup: async () => {
        await repository.save<typeof value>({ key: input.key, value })
      },
      expected: async (result: any) => {
        const cache = await repository.retrieve({ key: input.key });
        expect(fn).toHaveBeenCalledTimes(0);
        expect(result).toStrictEqual(output)
        expect(cache).toStrictEqual(result);
      }
    },
    {
      should: 'Should execute fn and save cache & returns successfuly in Redis',
      input,
      setup: async () => {
        await repository.remove({ key: input.key });
      },
      expected: async (result: any) => {
        const cache = await repository.retrieve({ key: input.key });
        expect(fn).toHaveBeenCalledTimes(1);
        expect(result).toStrictEqual(output)
        expect(cache).toStrictEqual(result);
      }
    },
    {
      should: 'Should execute fn and save cache & returns successfuly in Redis when no_cache is true',
      input: { ...input, no_cache: true },
      setup: async () => {
        await repository.remove({ key: input.key });
      },
      expected: async (result: any) => {
        const cache = await repository.retrieve({ key: input.key });
        expect(fn).toHaveBeenCalledTimes(1);
        expect(result).toStrictEqual(output)
        expect(cache).toStrictEqual(result);
      }
    },
  ])('$should', async ({ expected, input, setup }) => {
    if (setup) await setup();
    return action.execute<typeof value>(input).then(expected).catch(expected);
  })
})