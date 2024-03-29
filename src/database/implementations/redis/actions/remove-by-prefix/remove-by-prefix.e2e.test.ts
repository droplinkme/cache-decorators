import { AdaptersEnum } from "@database/enums"
import { ICacheRepository, RemoveByPrefixActionInput } from "@database/index"
import 'dotenv/config';
import { disconnectTestRepository, initializeTestRepository } from "@database/fake/initialize";
import { randomUUID } from "crypto";
import { Redis } from "ioredis";
import { RemoveByPrefixAction } from "./action";

describe('REDIS REMOVE BY PREFIX ACTION', () => {
  let repository: ICacheRepository<AdaptersEnum.REDIS, Redis>;
  let action: RemoveByPrefixAction

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
    action = new RemoveByPrefixAction(repository);
  })

  const input: RemoveByPrefixActionInput = {
    prefix: randomUUID()
  }

  const keys = Array.from({ length: 10 }, () => randomUUID());
  const values = keys.map(key => ({ key: `${input.prefix}/${key}`, value: { id: randomUUID() } }));

  it.each([
    {
      should: 'Should remove by prefix cache successfuly in Redis',
      input,
      setup: async () => {
        await Promise.all(values.map(({ key, value }) => repository.save({ key, value })));
      },
      expected: async (result: any) => {
        const retrievalPromises = keys.map(key => repository.retrieve({ key }));
        const retrievedValues = await Promise.all(retrievalPromises);
        retrievedValues.forEach(value => expect(value).toBeUndefined());
        expect(result).toBeUndefined()
      }
    },
  ])('$should', async ({ expected, input, setup }) => {
    if (setup) await setup();
    return action.execute(input).then(expected).catch(expected);
  })
})