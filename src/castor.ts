/**
 * Only use body, header, querystring object in fastify, express RequestObject. Forced type-casting
 * key-value object, or json object type.
 */
export default function castor<T>(value: unknown): T {
  // eslint-disable-next-line
  const magicAny: any = value;
  return magicAny;
}
