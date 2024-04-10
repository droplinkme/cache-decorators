export function camelCaseSlugfy(value: string) {
  return value.replace(/[A-Z]/g, (match, offset) => (offset > 0 ? '-' : '') + match.toLowerCase())
}