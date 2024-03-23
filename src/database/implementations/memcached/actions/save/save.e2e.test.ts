import { AdaptersEnum } from "@database/enums"
import { ICacheRepository, SaveActionInput } from "@database/index"
import 'dotenv/config';
import { disconnectTestRepository, initializeTestRepository } from "@database/fake/initialize";
import { randomUUID } from "crypto";
import { Redis } from "ioredis";
import { SaveAction } from "./action";

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

  const output = {
    ...value,
  }

  it.each([
    {
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
      should: 'Should save cache successfuly in Redis with ttl',
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