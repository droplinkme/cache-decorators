type Args<I = any, R = any> = {
  instance: unknown;
  method: Function;
  args: I[];
  key?: string
  repository: R
}
export type Action<I = any, O = any, R = any> = (args: Args<I, R>) => Promise<O | undefined>