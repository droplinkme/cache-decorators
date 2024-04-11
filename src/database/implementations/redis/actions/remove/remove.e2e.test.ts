import { AdaptersEnum } from "@database/enums"
import { ICacheRepository, RemoveActionInput } from "@database/index"
import 'dotenv/config';
import { disconnectTestRepository, initializeTestRepository } from "@database/fake/initialize";
import { randomUUID } from "crypto";
import { Redis } from "ioredis";
import { RemoveAction } from "./action";
import { describe, beforeAll, afterAll, beforeEach, it, expect } from 'vitest'

describe('REDIS REMOVE ACTION', () => {
  let repository: ICacheRepository<AdaptersEnum.REDIS, Redis>;
  let action: RemoveAction

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
    action = new RemoveAction(repository);
  })

  const value = { id: randomUUID() };

  const input: RemoveActionInput = {
    key: randomUUID(),
  }

  it.each([
    {
      should: 'Should remove cache successfuly in Redis',
      input,
      setup: async () => {
        await repository.save({ key: input.key, value })
      },
      expected: async (result: any) => {
        const value = await repository.retrieve({ key: input.key })
        expect(value).toBeUndefined()
        expect(result).toBeUndefined()
      }
    },
  ])('$should', async ({ expected, input, setup }) => {
    if (setup) await setup();
    return action.execute<typeof value>(input).then(expected).catch(expected);
  })
})