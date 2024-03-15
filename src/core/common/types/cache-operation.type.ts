import { Input } from "./input.type";

export type CacheOperation<I = any, O = any> = (input: Input<I, O>) => MethodDecorator;