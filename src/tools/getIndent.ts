import type ICurlizeOptions from '#interfaces/ICurlizeOptions';
import { populate } from 'my-easy-fp';

export default function getIndent(options: Pick<ICurlizeOptions, 'indent' | 'prettify'>) {
  const size = options.indent ?? 2;

  if (options.prettify) {
    return populate(size)
      .map(() => ' ')
      .join('');
  }

  return '';
}
