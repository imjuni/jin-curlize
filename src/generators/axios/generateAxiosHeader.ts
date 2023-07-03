import getContentType from '#convertors/v3/getContentType';
import type IAxiosRequestConfigOptions from '#interfaces/IAxiosRequestConfigOptions';
import changeHeaderCase from '#tools/changeHeaderCase';
import defaultHeaderFilterItems from '#tools/defaultHeaderFilterItems';
import type { IncomingHttpHeaders } from 'http';
import type { IncomingHttpHeaders as IncomingHttpsHeaders } from 'http2';
import { parseBool } from 'my-easy-fp';

export default function generateAxiosHeader(
  httpHeaders: IncomingHttpHeaders | IncomingHttpsHeaders,
  options?: IAxiosRequestConfigOptions,
): Record<string, string | string[]> {
  const replacer = (headers: IncomingHttpHeaders | IncomingHttpsHeaders) => {
    if (options?.replacer?.header != null) {
      return options.replacer.header(headers);
    }

    const replaced = Object.entries(headers)
      .filter(([key]) => !(defaultHeaderFilterItems as readonly string[]).includes(key.trim().toLowerCase()))
      .reduce<IncomingHttpHeaders | IncomingHttpsHeaders>((agg, [key, value]) => {
        const nextKey = parseBool(options?.changeHeaderKey) ? changeHeaderCase(key) : key;
        return { ...agg, [nextKey]: value };
      }, {});

    return replaced;
  };

  const replaced = replacer(httpHeaders);

  // TODO: single space processing
  const headers = Object.entries(replaced).reduce<Record<string, string | string[]>>((aggregation, [key, value]) => {
    if (value != null) {
      if (key.toLocaleLowerCase() === 'content-type') {
        const refinedContentType = getContentType({ 'content-type': value as string });
        return { ...aggregation, [key]: refinedContentType };
      }

      return { ...aggregation, [key]: value };
    }

    return aggregation;
  }, {});

  return headers;
}
