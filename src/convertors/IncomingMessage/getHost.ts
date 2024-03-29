import type { IncomingHttpHeaders } from 'node:http';
import type { IncomingHttpHeaders as IncomingHttp2Headers } from 'node:http2';

export function getHost(headers: IncomingHttpHeaders | IncomingHttp2Headers): string {
  if (headers.host == null) {
    throw new Error('[getHost]invalid host from headers');
  }

  return headers.host;
}
