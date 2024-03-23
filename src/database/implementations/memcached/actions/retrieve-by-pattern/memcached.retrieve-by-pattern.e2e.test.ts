import { AdaptersEnum } from "@database/enums"
import { ICacheRepository, RetrieveByPatternActionInput } from "@database/index"
import 'dotenv/config';
import { disconnectTestRepository, initializeTestRepository } from "@database/fake/initialize";
import { randomUUID } from "crypto";
import { RetrieveByPatternAction } from "./action";
import Memcached from "memcached";

describe('MEMCACHED RETRIEVE BY PATTERN ACTION', () => {
  let repository: ICacheRepository<AdaptersEnum.MEMCACHED, Memcached>;

  beforeAll(async () => {
    repository = await initializeTestRepository(AdaptersEnum.MEMCACHED, {
      location: `${process.env.MEMCACHED_HOST}:${process.env.MEMCACHED_PORT}`,
    })
  })

  afterAll(async () => {
    await disconnectTestRepository(repository);
  })

  let action: RetrieveByPatternAction
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
      should: 'Should retrieve by pattern cache successfuly in Memcached',
      input,
      setup: async () => {
        await Promise.all(values.map(({ key, value }) => repository.save({ key, value })));
      },
      expected: async (result: any[]) => {
        const retrievalPromises = keys.map(key => repository.retrieve<{ id: string }>({ key }));
        const retrievedValues = await Promise.all(retrievalPromises) as unknown as { id: string }[];
        const compare = values.map(({ value }) => value)
        const sortedResult = result.sort((a, b) => a.id.localeCompare(b.id));
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