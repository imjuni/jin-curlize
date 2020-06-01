import { isEmpty } from 'my-easy-fp';
import { IRequestConvertorOptions } from '../interfaces/IRequestConvertorOptions';
import ll from '../ll';
import { getJoiner } from '../tools';

const log = ll('jcurlize', __filename);

export default function header<T>({
  convertor,
  request,
  options,
}: {
  convertor: (req: T) => { [key: string]: string | string[] } | undefined;
  request: T;
  options: IRequestConvertorOptions;
}): string | undefined {
  try {
    const converted = convertor(request);

    if (isEmpty(converted) || Object.keys(converted).length <= 0) {
      return undefined;
    }

    const filter = options.headerFilterKeywords ?? ['host', 'connection', 'accept', 'content-length', 'user-agent'];

    // single space 는 curl에서 좀 다르게 인식되는데 찾아볼 필요가 있을 것 같다
    // 사용하지 않아도 되는 내용을 필터링해서 걸러줌, 길이나 agent 등 몇 가지를 걸러줌
    const headers = Object.entries(converted)
      .filter(([key]) => filter.indexOf(key.toLowerCase()) < 0)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `--header '${key}: ${value.join(', ')}'`;
        }

        return `--header '${key}: ${value}'`;
      });

    if (options.prettify) {
      const joiner = getJoiner(options.indent);
      return headers.join(joiner);
    }

    return headers.join(' ');
  } catch (err) {
    log(err.message);
    log(err.stack);

    return undefined;
  }
}
