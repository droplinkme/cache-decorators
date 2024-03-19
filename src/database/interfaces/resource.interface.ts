import { DataSourceOptions } from "../types/data-source-options.type";
import { AdaptersEnum } from "@database/enums";

export abstract class IResource<Adapter extends AdaptersEnum = any, Client = any> {
  public _client?: Client
  public abstract connect(config: DataSourceOptions<Adapter>): Promise<this>;
  public abstract disconnect(): void;
  public abstract logger(error: any): void;
  public abstract validateConnection(): void
}
