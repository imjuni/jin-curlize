import { isNotEmpty } from 'my-easy-fp';
import { IRequestConvertorOptions } from '../interfaces/IRequestConvertorOptions';
import ll from '../ll';
import { getJoiner } from '../tools';

const log = ll('jcurlize', __filename);

export default function querystring<T>({
  convertor,
  request,
  options,
}: {
  convertor: (req: T) => { [key: string]: string | string[] } | undefined;
  request: T;
  options: IRequestConvertorOptions;
}): string | undefined {
  try {
    const converted = convertor(request) ?? {};
    const url = new URL('http://localhost');

    Object.entries(converted).forEach(([key, values]) => {
      if (Array.isArray(values)) {
        values.forEach((value) => url.searchParams.append(key, value));
      } else {
        url.searchParams.set(key, values);
      }
    });

    log('uuid 옵션 추가: ', options.uuid);

    if (options.prettify) {
      const joiner = getJoiner(options.indent);

      if (isNotEmpty(options.uuid)) {
        url.searchParams.set(options.uuid.paramName, `$(${options.uuid.command})`);
      }

      if (Array.from(url.searchParams).length <= 0) {
        return undefined;
      }

      const params = Array.from(url.searchParams.entries()).map(([key, value]) => {
        return `${key}=${value}`;
      });

      const [head, ...tail] = params;
      const questionAdded = `?${head}`;
      const ampersandAdded = tail.map((piece) => `&${piece}`);

      log('querystring아 젭알: ', joiner, [questionAdded, ...ampersandAdded]);
      return ['', questionAdded, ...ampersandAdded].join(joiner);
    }

    if (isNotEmpty(options.uuid)) {
      return Array.from(url.searchParams.values()).length <= 1
        ? `?${options.uuid.paramName}=$(${options.uuid?.command})`
        : `${url.search}&${options.uuid.paramName}=$(${options.uuid?.command})`;
    }

    if (Array.from(url.searchParams).length <= 0) {
      return undefined;
    }

    return url.search;
  } catch (err) {
    log(err.message);
    log(err.stack);

    return undefined;
  }
}
