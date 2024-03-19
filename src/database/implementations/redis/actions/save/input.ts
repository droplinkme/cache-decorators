export class Input<T = any> {
  key!: string;
  value!: T;
  ttl?: number;
}