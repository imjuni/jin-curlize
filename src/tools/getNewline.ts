import type ICurlizeOptions from '#interfaces/ICurlizeOptions';

export default function getNewline(options: ICurlizeOptions) {
  if (options.prettify) {
    return ' \\\n';
  }

  return ' ';
}
