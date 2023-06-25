import type { IncomingHttpHeaders } from 'http';
import type { IncomingHttpHeaders as IncomingHttpsHeaders } from 'http2';

/**
 * Generate Option
 */
export default interface ICurlizeOptions {
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
   * Disable redirection follow option. this option not setted or false, add --location option.
   */
  disableFollowRedirect?: boolean;

  /** replace input data for curl command building */
  replacer?: {
    querystring?: (qs: URLSearchParams) => URLSearchParams;
    header?: ((im: IncomingHttpHeaders) => IncomingHttpHeaders) | ((im: IncomingHttpsHeaders) => IncomingHttpsHeaders);
    body?: <T = unknown>(header: IncomingHttpHeaders | IncomingHttpsHeaders, data: T) => T;
  };
}
