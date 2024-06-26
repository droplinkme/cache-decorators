import { AdaptersEnum } from "@database/enums"
import { ICacheRepository, RetrieveByPatternActionInput } from "@database/index"
import 'dotenv/config';
import { disconnectTestRepository, initializeTestRepository } from "@database/fake/initialize";
import { randomUUID } from "crypto";
import { Redis } from "ioredis";
import { RetrieveByPatternAction } from "./action";

describe('REDIS RETRIEVE BY PATTERN ACTION', () => {
  let repository: ICacheRepository<AdaptersEnum.REDIS, Redis>;
  let action: RetrieveByPatternAction

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
    action = new RetrieveByPatternAction(repository);
  })

  const pattern = randomUUID();
  const input: RetrieveByPatternActionInput = {
    pattern: `*${pattern}`
  }

  const keys = Array.from({ length: 10 }, () => `${randomUUID()}/${pattern}`);
  const values = keys.map(key => ({ key, value: { id: randomUUID() } }));

  it.each([
    {
      should: 'Should retrieve by pattern cache successfuly in Redis',
      input,
      setup: async () => {
        await Promise.all(values.map(({ key, value }) => repository.save({ key, value })));
      },
      expected: async (result: any[]) => {
        const retrievalPromises = keys.map(key => repository.retrieve<{ id: string }>({ key }));
        const retrievedValues = await Promise.all(retrievalPromises) as unknown as { id: string }[];
        const compare = values.map(({ value }) => value)
        const sortedResult = result?.sort((a, b) => a.id.localeCompare(b.id));
        const sortedCompare = compare.sort((a, b) => a.id.localeCompare(b.id));
        const sortedRetrievedValues = retrievedValues.sort((a, b) => a.id.localeCompare(b.id))
        expect(sortedResult).toStrictEqual(sortedCompare)
        expect(sortedResult).toStrictEqual(sortedRetrievedValues)
        expect(sortedRetrievedValues).toStrictEqual(sortedCompare)
      }
    },
  ])('$should', async ({ expected, input, setup }) => {
    if (setup) await setup();
    return action.execute(input).then(expected).catch(expected);
  })
})