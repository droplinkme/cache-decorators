// import { getMetadataArgsStorage } from "@core/global";
// import { AdaptersEnum, DataSource, DataSourceOptions, ICacheRepository } from "@database/index"

// export async function initializeRepository<Adapter extends AdaptersEnum>(adapter: Adapter, options: DataSourceOptions<Adapter>) {
//   const repository = await new DataSource().initialize(adapter, options);
//   await new Promise((resolve) => {
//     setTimeout(resolve, 100)
//   })

//   // await repository.flushAll();
//   // return repository;
// }

// export async function disconnectRepository(repository: ICacheRepository) {
//   await new Promise((resolve) => {
//     setTimeout(resolve, 100)
//   })
//   await repository.flushAll()
//   repository.disconnect();
// }