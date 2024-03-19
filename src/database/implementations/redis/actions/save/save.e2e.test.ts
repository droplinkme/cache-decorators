import { AdaptersEnum } from "@database/enums"
import { ICacheRepository } from "@database/index"
import 'dotenv/config';
import { disconnectTestRepository, initializeTestRepository } from "@database/fake/initialize";
import { SaveAction } from "./save.action";
import { Input } from "./input";
import { randomUUID } from "crypto";
import { Redis } from "ioredis";

describe('Redis', () => {
  let repository: ICacheRepository<AdaptersEnum.REDIS, Redis>;
  let save: SaveAction

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
    save = new SaveAction(repository);
    await repository.flushAll()
  })

  const input: Input = {
    key: randomUUID(),
    value: { id: randomUUID() },
    ttl: 60
  }

  const output = {
    ...input.value,
  }

  it.each([
    {
      should: 'Should save cache successfuly in Redis',
      input,
      setup: async () => { },
      expected: async (result: any) => {
        expect(result).toStrictEqual(output)
        const cache = await repository.retrieve(input.key);
        expect(cache).toStrictEqual(result);
      }
    },
  ])('$should', async ({ expected, input, setup }) => {
    if (setup) await setup();
    return save.action(input).then(expected).catch(expected);
  })
})