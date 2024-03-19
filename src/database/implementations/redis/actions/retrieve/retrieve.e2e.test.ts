import { AdaptersEnum } from "@database/enums"
import { ICacheRepository, RetrieveActionInput } from "@database/index"
import 'dotenv/config';
import { disconnectTestRepository, initializeTestRepository } from "@database/fake/initialize";
import { randomUUID } from "crypto";
import { Redis } from "ioredis";
import { RetrieveAction } from "./action";

describe('REDIS RETRIEVE ACTION', () => {
  let repository: ICacheRepository<AdaptersEnum.REDIS, Redis>;
  let action: RetrieveAction

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
    action = new RetrieveAction(repository);
  })

  const value = { id: randomUUID() };

  const input: RetrieveActionInput = {
    key: randomUUID(),
  }

  const output = {
    ...value,
  }

  it.each([
    {
      should: 'Should save cache successfuly in Redis without ttl',
      input,
      setup: async () => {
        await repository.save({ key: input.key, value })
      },
      expected: async (result: any) => {
        expect(result).toStrictEqual(output)
      }
    },
  ])('$should', async ({ expected, input, setup }) => {
    if (setup) await setup();
    return action.execute<typeof value>(input).then(expected).catch(expected);
  })
})