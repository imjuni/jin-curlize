import type IAxiosRequestConfigOptions from '#interfaces/IAxiosRequestConfigOptions';
import type { JSONValue } from '#interfaces/JSONValue';
import type { IncomingHttpHeaders } from 'http';
import type { IncomingHttpHeaders as IncomingHttpsHeaders } from 'http2';
import qs from 'qs';

export default function generateAxiosBody(
  httpHeaders: IncomingHttpHeaders | IncomingHttpsHeaders,
  body: { form: boolean; data?: JSONValue },
  options?: IAxiosRequestConfigOptions,
): JSONValue | undefined {
  const { data } = body;

  if (data == null) {
    return undefined;
  }

  const replacer = (bodyData: JSONValue) => {
    if (options?.replacer?.body != null) {
      return options.replacer.body(httpHeaders, bodyData) as JSONValue;
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
