import { getHost } from '#/convertors/IncomingMessage/getHost';
import { getMethod } from '#/convertors/IncomingMessage/getMethod';
import { getUrl } from '#/convertors/IncomingMessage/getUrl';
import { getBody } from '#/convertors/v3/getBody';
import { generateFastifyBody } from '#/generators/fastify/generateFastifyBody';
import { generateFastifyHeader } from '#/generators/fastify/generateFastifyHeader';
import { generateFastifyQuerystring } from '#/generators/fastify/generateFastifyQuerystring';
import type { ICurlizeOptions } from '#/interfaces/ICurlizeOptions';
import { getIndent } from '#/tools/getIndent';
import { getNewline } from '#/tools/getNewline';
import type { FastifyRequest } from 'fastify';
import type { IncomingMessage } from 'node:http';

export function createFromFastify3<T = unknown>(
  req: Pick<FastifyRequest, 'raw' | 'body'>,
  options: ICurlizeOptions<T>,
): string {
  const im: IncomingMessage = req.raw;

  const url = getUrl(im.url, `http://${getHost(im.headers)}`);

  const command = [
    ['curl'],
    [
      `${getIndent(options)}-X ${getMethod(im.method)} '${[url.protocol, '//', url.host, url.pathname].join(
        '',
      )}${generateFastifyQuerystring(url, options)}'`,
    ],
    [options.disableFollowRedirect ?? true ? undefined : '--location'],
    generateFastifyHeader(im.headers, options),
    generateFastifyBody(im.headers, getBody(req, options), options),
  ]
    .flat()
    .filter((element) => element != null);

  return command.join(getNewline(options));
}
