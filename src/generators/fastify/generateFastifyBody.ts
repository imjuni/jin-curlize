import type ICurlizeOptions from '#interfaces/ICurlizeOptions';
import type { JSONValue } from '#interfaces/JSONValue';
import getIndent from '#tools/getIndent';
import shellescape from '#tools/shellescape';
import fastSafeStringify from 'fast-safe-stringify';
import type { IncomingHttpHeaders } from 'http';
import type { IncomingHttpHeaders as IncomingHttpsHeaders } from 'http2';

export default function generateFastifyBody(
  httpHeaders: IncomingHttpHeaders | IncomingHttpsHeaders,
  body: { form: boolean; data?: JSONValue },
  options: ICurlizeOptions,
): string[] {
  const { data } = body;

  const replacer = (bodyData: JSONValue) => {
    if (options.replacer?.body != null) {
      return options.replacer.body(httpHeaders, bodyData) as JSONValue;
    }

    return bodyData;
  };

  const replaced = replacer(data);

  if (replaced == null) {
    return [];
  }

  // Content-Type is application/x-www-form-urlencoded or multipart/form-data that do qs.stirng
  if (body.form) {
    const indent = getIndent(options);
    return [
      [
        indent,
        ['--form', `$${shellescape([fastSafeStringify(replaced)])}`].filter((item) => item !== '').join(' '),
      ].join(''),
    ];
  }

  const indent = getIndent(options);
  return [
    [indent, ['--data', `$${shellescape([fastSafeStringify(replaced)])}`].filter((item) => item !== '').join(' ')].join(
      '',
    ),
  ];
}
