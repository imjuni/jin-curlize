import type { IncomingHttpHeaders } from 'http';
import type { IncomingHttpHeaders as IncomingHttp2Headers } from 'http2';

export function getHost(headers: IncomingHttpHeaders | IncomingHttp2Headers): string {
  if (headers.host == null) {
    throw new Error('[getHost]invalid host from headers');
  }

  return headers.host;
}
