import getMethod from '#convertors/IncomingMessage/getMethod';
import getUrl from '#convertors/IncomingMessage/getUrl';
import getBody from '#convertors/v3/getBody';
import generateBody from '#generators/generateBody';
import generateHeader from '#generators/generateHeader';
import generateQuerystring from '#generators/generateQuerystring';
import type ICurlizeOptions from '#interfaces/ICurlizeOptions';
import getIndent from '#tools/getIndent';
import getNewline from '#tools/getNewline';
import type { FastifyRequest } from 'fastify';
import type { IncomingMessage } from 'node:http';

export default function createFromFastify3(
  req: Pick<FastifyRequest, 'raw' | 'body'>,
  options: ICurlizeOptions,
): string {
  const im: IncomingMessage = req.raw;

  const url = getUrl(im.url, `http://${im.headers.host!}`);

  const command = [
    ['curl'],
    [
      `${getIndent(options)}-X ${getMethod(im.method)} '${[url.protocol, '//', url.host, url.pathname].join(
        '',
      )}${generateQuerystring(url, options)}'`,
    ],
    [options.disableFollowRedirect ?? true ? undefined : '--location'],
    generateHeader(im.headers, options),
    generateBody(getBody(req, options), options),
  ]
    .flat()
    .filter((element) => element != null);

  return command.join(getNewline(options));
}
