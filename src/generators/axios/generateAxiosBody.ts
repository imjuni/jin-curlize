import type IAxiosRequestConfigOptions from '#interfaces/IAxiosRequestConfigOptions';
import type { IncomingHttpHeaders } from 'http';
import type { IncomingHttpHeaders as IncomingHttpsHeaders } from 'http2';
import qs from 'qs';

export default function generateAxiosBody<T = unknown>(
  httpHeaders: IncomingHttpHeaders | IncomingHttpsHeaders,
  body: { form: boolean; data?: T },
  options?: IAxiosRequestConfigOptions<T>,
): T | string | undefined {
  const { data } = body;

  if (data == null) {
    return undefined;
  }

  const replacer = (bodyData?: T) => {
    if (options?.replacer?.body != null) {
      return options.replacer.body(httpHeaders, bodyData);
    }

    return bodyData;
  };

  const replaced = replacer(data);

  // Content-Type is application/x-www-form-urlencoded or multipart/form-data that do qs.stirng
  if (body.form) {
    return qs.stringify(replaced, { arrayFormat: 'repeat' });
  }

  return replaced;
}
