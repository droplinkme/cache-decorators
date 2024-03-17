import { AdapterOptions } from './adapter-options.type';
import { AdaptersEnum } from '@database/enums';

export type DataSourceOptions<Adapter extends AdaptersEnum> = Adapter extends AdaptersEnum ? AdapterOptions[Adapter] : never;
