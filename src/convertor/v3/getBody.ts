import getContentType from '#convertor/v3/getContentType';
import type ICurlizeOptions from '#interfaces/ICurlizeOptions';
import type { JSONObject } from '#interfaces/JSONValue';
import type { FastifyRequest } from 'fastify';
import getDefaultMultipartFormTransformer from './getDefaultMultipartFormTransformer';

export default function getBody(
  req: Pick<FastifyRequest, 'body'> & { raw: Pick<FastifyRequest['raw'], 'headers'> },
  options: ICurlizeOptions,
): { form: boolean; data?: JSONObject } {
  const contentType = getContentType(req.raw.headers);
  const isForm =
    contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data');

  if (req.body == null) {
    return { form: isForm };
  }

  if (contentType === 'multipart/form-data') {
    const body = getDefaultMultipartFormTransformer(req, options);

    return { form: isForm, data: body as JSONObject };
  }

  return { form: isForm, data: req.body as JSONObject };
}
