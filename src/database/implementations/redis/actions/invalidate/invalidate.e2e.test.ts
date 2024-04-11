import { AdaptersEnum } from "@database/enums"
import { ICacheRepository, InvalidateActionInput } from "@database/index"
import 'dotenv/config';
import { disconnectTestRepository, initializeTestRepository } from "@database/fake/initialize";
import { randomUUID } from "crypto";
import { Redis } from "ioredis";
import { InvalidateAction } from "./action";
import { describe, beforeAll, afterAll, beforeEach, it, expect } from 'vitest'

describe('REDIS INVALIDATE ACTION', () => {
  let repository: ICacheRepository<AdaptersEnum.REDIS, Redis>;
  let action: InvalidateAction

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
    action = new InvalidateAction(repository);
  })

  const value = { id: randomUUID() };

  const input: InvalidateActionInput = {
    key: randomUUID(),
  }

  it.each([
    {
      should: 'Should invalidate cache successfuly in Redis',
      input,
      setup: async () => {
        await repository.save({ key: input.key, value })
      },
      expected: async (result: any) => {
        const beforeRetrieve = await repository.retrieve({ key: input.key })
        expect(beforeRetrieve).toStrictEqual(value)
        await new Promise((resolve) => {
          setTimeout(resolve, 1000)
        })
        const afterRetrieve = await repository.retrieve({ key: input.key })
        expect(afterRetrieve).toBeUndefined()
        expect(result).toBeUndefined()
      }
    },
  ])('$should', async ({ expected, input, setup }) => {
    if (setup) await setup();
    return action.execute<typeof value>(input).then(expected).catch(expected);
  })
})