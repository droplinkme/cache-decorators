export type Key<I = any, O = any> = string | ((input: I, output?: O) => string | Promise<string>);