import { CE_FORM_CONTENT_TYPE } from '#/interfaces/CE_FORM_CONTENT_TYPE';
import { first } from 'my-easy-fp';
import type { IncomingHttpHeaders } from 'node:http';
import type { IncomingHttpHeaders as IncomingHttpsHeaders } from 'node:http2';

export function getContentType(header: IncomingHttpHeaders | IncomingHttpsHeaders): string {
  const rawContentType = header['content-type']?.toLowerCase();

  const contentType =
    rawContentType == null || rawContentType === '' ? CE_FORM_CONTENT_TYPE.JSON : rawContentType.toLowerCase();

  const parts = contentType.split(';').map((part) => part.trim());
  const firstParts = first(parts);
  return firstParts;
}
