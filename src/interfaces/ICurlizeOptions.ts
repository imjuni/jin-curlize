import type { IncomingHttpHeaders } from 'node:http';
import type { IncomingHttpHeaders as IncomingHttpsHeaders } from 'node:http2';

/**
 * Generate Option
 */
export interface ICurlizeOptions<T = unknown> {
  /**
   * prettify command. use newline charactor
   * */
  prettify: boolean;

  /**
   * indent size, it pass to stringify
   *
   * @default 2
   * */
  indent?: number;

  /**
   * change header key case. [IncomingHttpHeaders](https://github.com/nodejs/node/blob/v16.9.0/lib/http.js) makes
   * header key lowercase. For example, `Content-Type` to `content-type`. `changeHeaderKey` option makes
   * to uppercase first character.
   *
   * eg. content-type > Content-Type
   */
  changeHeaderKey?: boolean;

  /**
   * Disable redirection follow option. this option not setted or false, add --location option.
   */
  disableFollowRedirect?: boolean;

  /** replace input data for curl command building */
  replacer?: {
    querystring?: (qs: URLSearchParams) => URLSearchParams;
    header?: ((im: IncomingHttpHeaders) => IncomingHttpHeaders) | ((im: IncomingHttpsHeaders) => IncomingHttpsHeaders);
    body?: (header: IncomingHttpHeaders | IncomingHttpsHeaders, data?: T) => T | undefined;
  };
}
