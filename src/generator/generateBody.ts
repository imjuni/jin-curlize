import type ICurlizeOptions from '#interfaces/ICurlizeOptions';
import type { JSONValue } from '#interfaces/JSONValue';
import getIndent from '#tools/getIndent';
import shellescape from '#tools/shellescape';
import fastSafeStringify from 'fast-safe-stringify';

export default function generateBody(body: { form: boolean; data?: JSONValue }, options: ICurlizeOptions): string[] {
  const { data } = body;

  if (data == null) {
    return [];
  }

  // application/x-www-form-urlencoded 방식인가 아닌가
  if (body.form) {
    return Object.entries(data)
      .map<[string, string][]>(([key, values]) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return Array.isArray(values) ? values.map((value) => [key, value]) : [[key, values]];
      })
      .flat()
      .map(([key, value]) => `${getIndent(options)}--data ${key}='${value}'`);
  }

  return [
    [getIndent(options), '--data', `$${shellescape([fastSafeStringify(body.data)])}`]
      .filter((item) => item !== '')
      .join(' '),
  ];
}
