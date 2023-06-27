import getContentType from '#convertors/v3/getContentType';
import type ICurlizeOptions from '#interfaces/ICurlizeOptions';
import type IFastifyMultipartFormData from '#interfaces/IFastifyMultipartFormData';
import type { FastifyRequest } from 'fastify';

export default function getDefaultMultipartFormTransformer(
  req: Pick<FastifyRequest, 'body'> & { raw: Pick<FastifyRequest['raw'], 'headers'> },
  options: ICurlizeOptions,
) {
  const contentType = getContentType(req.raw.headers);

  if (contentType === 'multipart/form-data' && options.replacer?.body == null) {
    const body = req.body as Record<string, IFastifyMultipartFormData | IFastifyMultipartFormData[]>;

    const refined = Object.entries(body)
      .map(([key, value]) => {
        return { key, value };
      })
      .map((entry) => {
        if (Array.isArray(entry.value)) {
          return entry.value.map((item) => ({ key: entry.key, type: item.type, value: item.value }));
        }

        return [{ key: entry.key, value: entry.value.value, type: entry.value.type }];
      })
      .flat()
      .filter((entry) => entry.type === 'field')
      .reduce<Record<string, unknown>>((aggregation, entry) => {
        const value = aggregation[entry.key];

        if (value != null && !Array.isArray(value)) {
          return { ...aggregation, [entry.key]: [value, entry.value] };
        }

        if (value != null && Array.isArray(value)) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          return { ...aggregation, [entry.key]: [...value, entry.value] };
        }

        return { ...aggregation, [entry.key]: entry.value };
      }, {});

    return refined;
  }

  return req.body;
}
