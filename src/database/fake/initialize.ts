import { DataSource } from "@database/datasource";
import { AdaptersEnum } from "@database/enums";
import { ICacheRepository } from "@database/interfaces";
import { DataSourceOptions } from "@database/types";

export async function initializeTestRepository<Adapter extends AdaptersEnum>(adapter: Adapter, options: DataSourceOptions<Adapter>) {
  const repository = await DataSource.initialize<Adapter>(adapter, options);
  await new Promise((resolve) => {
    setTimeout(resolve, 200)
  })
  return repository;
}

export async function disconnectTestRepository(repository: ICacheRepository) {
  await new Promise((resolve) => {
    setTimeout(resolve, 200)
  })
  await repository.flushAll()
  repository.disconnect();
}