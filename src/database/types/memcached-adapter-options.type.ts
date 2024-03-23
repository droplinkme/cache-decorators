import { options, Location } from 'memcached'
export interface MemcachedAdapterOptions extends options {
  location: Location
};