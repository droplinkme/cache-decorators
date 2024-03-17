import { DataSourceOptions } from "..";
import { AdaptersEnum } from "@database/enums";

export abstract class IResource<Adapter extends AdaptersEnum = any, Client = any> {
  public _client?: Client
  public abstract connect(config: DataSourceOptions<Adapter>): this | Promise<this>;
  public abstract disconnect(): void;
  public abstract validateConnection(): void
}
