import type IAxiosRequestConfigOptions from '#interfaces/IAxiosRequestConfigOptions';
import { first, settify } from 'my-easy-fp';

export default function generateAxiosQuerystring<T = unknown>(
  url: URL,
  options?: IAxiosRequestConfigOptions<T>,
): Record<string, string | string[]> | undefined {
  const replacer = (searchParams: URLSearchParams): URLSearchParams => {
    if (options?.replacer?.querystring != null) {
      return options.replacer.querystring(searchParams);
    }

    return searchParams;
  };

  const replaced = replacer(url.searchParams);
  const keys = settify(Array.from(replaced.keys()));

  if (keys.length <= 0) {
    return undefined;
  }

  const generated = keys.reduce<Record<string, string | string[]>>((aggregation, key) => {
    const values = replaced.getAll(key);
    const value = values.length <= 1 ? first(values) : values;
    return { ...aggregation, [key]: value };
  }, {});

  return generated;
}
