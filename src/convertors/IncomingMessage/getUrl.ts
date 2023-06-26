export default function getUrl(input: string | undefined, base: string): URL {
  if (input == null) {
    throw new Error('invalid url');
  }

  return new URL(input, base);
}
