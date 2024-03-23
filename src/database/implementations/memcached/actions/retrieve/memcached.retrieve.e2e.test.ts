import { AdaptersEnum } from "@database/enums"
import { ICacheRepository, RetrieveActionInput } from "@database/index"
import 'dotenv/config';
import { disconnectTestRepository, initializeTestRepository } from "@database/fake/initialize";
import { randomUUID } from "crypto";
import { RetrieveAction } from "./action";
import Memcached from "memcached";

describe('MEMCACHED RETRIEVE ACTION', () => {
  let repository: ICacheRepository<AdaptersEnum.MEMCACHED, Memcached>;

  beforeAll(async () => {
    repository = await initializeTestRepository(AdaptersEnum.MEMCACHED, {
      location: `${process.env.MEMCACHED_HOST}:${process.env.MEMCACHED_PORT}`,
    })
  })

  afterAll(async () => {
    await disconnectTestRepository(repository);
  })

  let action: RetrieveAction

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
      should: 'Should retrieve cache successfuly in Redis',
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