import { AdaptersEnum } from "@database/enums"
import { ICacheRepository, SaveActionInput } from "@database/index"
import 'dotenv/config';
import { disconnectTestRepository, initializeTestRepository } from "@database/fake/initialize";
import { randomUUID } from "crypto";
import { Redis } from "ioredis";
import { SaveAction } from "./action";
import { CachePrefixEnum } from "@core/enums";
import { describe, beforeAll, afterAll, beforeEach, it, expect } from 'vitest'

describe('REDIS SAVE ACTION', () => {
  let repository: ICacheRepository<AdaptersEnum.REDIS, Redis>;
  let action: SaveAction

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
    action = new SaveAction(repository);
  })

  const value = { id: randomUUID() };

  const input: SaveActionInput<typeof value> = {
    key: randomUUID(),
    value,
    ttl: 60
  }

  const fallback_key = `${CachePrefixEnum.FALLBACK}/${input.key}`

  const output = {
    ...value,
  }

  it.each([
    {
      run: true,
      should: 'Should save cache successfuly in Redis without ttl',
      input: { ...input, ttl: undefined },
      setup: async () => { },
      expected: async (result: any) => {
        expect(result).toStrictEqual(output)
        const cache = await repository.retrieve({ key: input.key });
        expect(cache).toStrictEqual(result);
      }
    },
    {
      run: true,
      should: 'Should save cache successfuly in Redis with fallback',
      input: { ...input, fallback: true },
      setup: async () => { },
      expected: async (result: any) => {
        expect(result).toStrictEqual(output)
        const cache = await repository.retrieve({ key: input.key });
        const fallback_cache = await repository.retrieve({ key: fallback_key });
        expect(cache).toStrictEqual(result);
        expect(fallback_cache).toStrictEqual(result);
      }
    },
    {
      run: true,
      should: 'Should save cache successfuly in Redis with ttl',
      input,
      setup: async () => { },
      expected: async (result: any) => {
        expect(result).toStrictEqual(output)
        const cache = await repository.retrieve({ key: input.key });
        expect(cache).toStrictEqual(result);
      }
    },
  ])('$should', async ({ run, expected, input, setup }) => {
    if (!run) return;
    if (setup) await setup();
    return action.execute<typeof value>(input).then(expected).catch(expected);
  })
})