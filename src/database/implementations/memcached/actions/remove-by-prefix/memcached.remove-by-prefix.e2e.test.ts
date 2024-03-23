import { AdaptersEnum } from "@database/enums"
import { ICacheRepository, RemoveByPrefixActionInput } from "@database/index"
import 'dotenv/config';
import { disconnectTestRepository, initializeTestRepository } from "@database/fake/initialize";
import { randomUUID } from "crypto";
import { RemoveByPrefixAction } from "./action";
import Memcached from "memcached";

describe('MEMCACHED REMOVE BY PREFIX ACTION', () => {
  let repository: ICacheRepository<AdaptersEnum.MEMCACHED, Memcached>;

  beforeAll(async () => {
    repository = await initializeTestRepository(AdaptersEnum.MEMCACHED, {
      location: `${process.env.MEMCACHED_HOST}:${process.env.MEMCACHED_PORT}`,
    })
  })

  // afterAll(async () => {
  //   await disconnectTestRepository(repository);
  // })

  let action: RemoveByPrefixAction

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
      should: 'Should remove by prefix cache successfuly in Memcached',
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