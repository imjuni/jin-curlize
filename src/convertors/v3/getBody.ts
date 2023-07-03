import getContentType from '#convertors/v3/getContentType';
import getDefaultMultipartFormTransformer from '#convertors/v3/getDefaultMultipartFormTransformer';
import { CE_FORM_CONTENT_TYPE } from '#interfaces/CE_FORM_CONTENT_TYPE';
import type IAxiosRequestConfigOptions from '#interfaces/IAxiosRequestConfigOptions';
import type ICurlizeOptions from '#interfaces/ICurlizeOptions';
import type { JSONObject } from '#interfaces/JSONValue';
import type { FastifyRequest } from 'fastify';

export default function getBody(
  req: Pick<FastifyRequest, 'body'> & { raw: Pick<FastifyRequest['raw'], 'headers'> },
  options?: Pick<ICurlizeOptions, 'replacer'> | Pick<IAxiosRequestConfigOptions, 'replacer'>,
): { form: boolean; data?: JSONObject } {
  const contentType = getContentType(req.raw.headers);
  const isForm =
    contentType.includes(CE_FORM_CONTENT_TYPE.URL_ENCODE) || contentType.includes(CE_FORM_CONTENT_TYPE.MULTI_PART);

  if (req.body == null) {
    return { form: isForm };
  }

  if (contentType === CE_FORM_CONTENT_TYPE.MULTI_PART) {
    const body = getDefaultMultipartFormTransformer(req, options);

    return { form: isForm, data: body as JSONObject };
  }

  return { form: isForm, data: req.body as JSONObject };
}
