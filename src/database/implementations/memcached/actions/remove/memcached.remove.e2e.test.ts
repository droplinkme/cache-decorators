import { AdaptersEnum } from "@database/enums"
import { ICacheRepository, RemoveActionInput } from "@database/index"
import 'dotenv/config';
import { disconnectTestRepository, initializeTestRepository } from "@database/fake/initialize";
import { randomUUID } from "crypto";
import { RemoveAction } from "./action";
import Memcached from "memcached";

describe('MEMCACHED REMOVE ACTION', () => {
  let repository: ICacheRepository<AdaptersEnum.MEMCACHED, Memcached>;

  beforeAll(async () => {
    repository = await initializeTestRepository(AdaptersEnum.MEMCACHED, {
      location: `${process.env.MEMCACHED_HOST}:${process.env.MEMCACHED_PORT}`,
    })
  })

  afterAll(async () => {
    await disconnectTestRepository(repository);
  })

  let action: RemoveAction

  beforeEach(async () => {
    action = new RemoveAction(repository);
  })

  const value = { id: randomUUID() };

  const input: RemoveActionInput = {
    key: randomUUID(),
  }

  it.each([
    {
      should: 'Should remove cache successfuly in Memcached',
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