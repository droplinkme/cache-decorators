import { AdaptersEnum } from "@database/enums"
import { ICacheRepository, RetrieveOrSaveActionInput } from "@database/index"
import 'dotenv/config';
import { disconnectTestRepository, initializeTestRepository } from "@database/fake/initialize";
import { randomUUID } from "crypto";
import { Redis } from "ioredis";
import { RetrieveOrSaveAction } from "./action";
import { CachePrefixEnum } from "@core/enums";

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

  const fn = jest.fn(async () => { return value });

  const input: RetrieveOrSaveActionInput<typeof value> = {
    key: randomUUID(),
    fn,
    ttl: 60,
    no_cache: false
  }

  const fallback_key = `${CachePrefixEnum.FALLBACK}/${input.key}`;

  const output = {
    ...value,
  }

  it.each([
    {
      run: true,
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
      run: true,
      should: 'Should execute fn and save cache & returns successfuly in Redis and save fallback',
      input: { ...input, fallback: true },
      setup: async () => {
        await repository.remove({ key: input.key });
        await repository.remove({ key: fallback_key });
      },
      expected: async (result: any) => {
        const cache = await repository.retrieve({ key: input.key });
        const fallback_cache = await repository.retrieve({ key: fallback_key });
        expect(fn).toHaveBeenCalledTimes(1);
        expect(result).toStrictEqual(output)
        expect(cache).toStrictEqual(result);
        expect(fallback_cache).toStrictEqual(result);
      }
    },
    {
      run: true,
      should: 'Should execute fn and save cache & returns successfuly in Redis when no_cache is true',
      input: { ...input, no_cache: true },
      setup: async () => {
        await repository.remove({ key: input.key });
        await repository.remove({ key: fallback_key });
      },
      expected: async (result: any) => {
        const cache = await repository.retrieve({ key: input.key });
        expect(fn).toHaveBeenCalledTimes(1);
        expect(result).toStrictEqual(output)
        expect(cache).toStrictEqual(result);
      }
    },
    {
      run: true,
      should: 'Should return fallback value cached when fallback is true have any throw error',
      input: { ...input, fallback: true },
      setup: async () => {
        await repository.remove({ key: input.key });
        await repository.save<typeof value>({ key: `${CachePrefixEnum.FALLBACK}/${input.key}`, value });
        fn.mockImplementationOnce(() => {
          throw new Error("Some Error")
        })
      },
      expected: async (result: any) => {
        const cache = await repository.retrieve({ key: input.key });
        const fallback_cache = await repository.retrieve({ key: `${CachePrefixEnum.FALLBACK}/${input.key}` });
        expect(fn).toHaveBeenCalledTimes(1);
        expect(result).toStrictEqual(output)
        expect(fallback_cache).toStrictEqual(output)
        expect(cache).toBeUndefined();
      }
    },
    {
      run: true,
      should: 'Should throw error if have any error and fallback is false or undefined',
      input: { ...input },
      setup: async () => {
        await repository.remove({ key: input.key });
        await repository.remove({ key: fallback_key });
        fn.mockImplementationOnce(() => {
          throw new Error("Some Error")
        })
      },
      expected: async (result: any) => {
        const cache = await repository.retrieve({ key: input.key });
        const fallback_cache = await repository.retrieve({ key: `${CachePrefixEnum.FALLBACK}/${input.key}` });
        expect(fn).toHaveBeenCalledTimes(1);
        expect(result).toBeInstanceOf(Error)
        expect(fallback_cache).toBeUndefined()
        expect(cache).toBeUndefined();
      }
    },
  ])('$should', async ({ run, expected, input, setup }) => {
    if (!run) return;
    if (setup) await setup();
    return action.execute<typeof value>(input).then(expected).catch(expected);
  })
})