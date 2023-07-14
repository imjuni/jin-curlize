import type ICurlizeOptions from '#interfaces/ICurlizeOptions';

export default function getNewline<T = unknown>(options: ICurlizeOptions<T>) {
  if (options.prettify) {
    return ' \\\n';
  }

  return ' ';
}
