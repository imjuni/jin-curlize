import getContentType from '#convertors/v3/getContentType';
import type ICurlizeOptions from '#interfaces/ICurlizeOptions';
import defaultHeaderFilterItems from '#tools/defaultHeaderFilterItems';
import getIndent from '#tools/getIndent';
import type { IncomingHttpHeaders } from 'http';
import type { IncomingHttpHeaders as IncomingHttpsHeaders } from 'http2';

export default function generateHeader(
  httpHeaders: IncomingHttpHeaders | IncomingHttpsHeaders,
  options: ICurlizeOptions,
): string[] | undefined {
  const replacer = (headers: IncomingHttpHeaders | IncomingHttpsHeaders) => {
    if (options.replacer?.header != null) {
      return options.replacer.header(headers);
    }

    const replaced = Object.entries(headers)
      .filter(([key]) => !(defaultHeaderFilterItems as readonly string[]).includes(key.trim().toLowerCase()))
      .reduce<IncomingHttpHeaders | IncomingHttpsHeaders>((agg, [key, value]) => {
        return { ...agg, [key]: value };
      }, {});

    return replaced;
  };

  const replaced = replacer(httpHeaders);

  // TODO: single space processing
  const headers = Object.entries(replaced).map(([key, value]) => {
    if (Array.isArray(value)) {
      return `${getIndent(options)}--header '${key}: ${value.join(',')}'`;
    }

    if (key.toLocaleLowerCase() === 'content-type') {
      const refinedContentType = getContentType({ 'content-type': value });
      return `${getIndent(options)}--header '${key}: ${refinedContentType}'`;
    }

    return `${getIndent(options)}--header '${key}: ${value ?? ' '}'`;
  });

  return headers;
}
