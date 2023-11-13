export function getUrl(input: string | undefined, base: string): URL {
  if (input == null) {
    throw new Error(`[getUrl]invalid url from undefined/${base}`);
  }

  return new URL(input, base);
}
