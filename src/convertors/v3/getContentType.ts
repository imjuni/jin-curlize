import { CE_FORM_CONTENT_TYPE } from '#/interfaces/CE_FORM_CONTENT_TYPE';
import type { IncomingHttpHeaders } from 'http';
import type { IncomingHttpHeaders as IncomingHttpsHeaders } from 'http2';
import { first } from 'my-easy-fp';

export function getContentType(header: IncomingHttpHeaders | IncomingHttpsHeaders): string {
  const rawContentType = header['content-type']?.toLowerCase();

  const contentType =
    rawContentType == null || rawContentType === '' ? CE_FORM_CONTENT_TYPE.JSON : rawContentType.toLowerCase();

  const parts = contentType.split(';').map((part) => part.trim());
  const firstParts = first(parts);
  return firstParts;
}
