import { getContentType } from '#/convertors/v3/getContentType';
import type { ICurlizeOptions } from '#/interfaces/ICurlizeOptions';
import { changeHeaderCase } from '#/tools/changeHeaderCase';
import { defaultHeaderFilterItems } from '#/tools/defaultHeaderFilterItems';
import { getIndent } from '#/tools/getIndent';
import { parseBool } from 'my-easy-fp';
import type { IncomingHttpHeaders } from 'node:http';
import type { IncomingHttpHeaders as IncomingHttpsHeaders } from 'node:http2';

export function generateFastifyHeader<T = unknown>(
  httpHeaders: IncomingHttpHeaders | IncomingHttpsHeaders,
  options: ICurlizeOptions<T>,
): string[] | undefined {
  const replacer = (headers: IncomingHttpHeaders | IncomingHttpsHeaders) => {
    const processDefaultHeaderReplacer = () => {
      const replaced = Object.entries(headers)
        .filter(([key]) => !(defaultHeaderFilterItems as readonly string[]).includes(key.trim().toLowerCase()))
        .reduce<IncomingHttpHeaders | IncomingHttpsHeaders>((agg, [key, value]) => {
          const nextKey = parseBool(options.changeHeaderKey) ? changeHeaderCase(key) : key;
          return { ...agg, [nextKey]: value };
        }, {});

      return replaced;
    };

    if (options.replacer?.header != null) {
      try {
        return options.replacer.header(headers);
      } catch {
        return processDefaultHeaderReplacer();
      }
    }

    return processDefaultHeaderReplacer();
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
