import { createHash } from "crypto";

export function createHashedKey(hashable: any, prefix?: string): string {
  const hash = createHash('md5')
    .update(JSON.stringify(hashable))
    .digest('hex');

  return `${prefix ?? ''}${hash}`;
}