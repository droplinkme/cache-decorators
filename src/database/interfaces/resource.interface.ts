import { Adapter } from "@database/adapters";
import { DataSourceOptions } from "..";

export abstract class IResource<T extends keyof typeof Adapter, Client> {
  _client!: Client
  protected abstract connect(config: DataSourceOptions<T>): Promise<void>;
  protected abstract disconnect(): void;
  public abstract validateConnection(): void
}