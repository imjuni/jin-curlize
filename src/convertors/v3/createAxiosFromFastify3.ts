import { getHost } from '#/convertors/IncomingMessage/getHost';
import { getMethod } from '#/convertors/IncomingMessage/getMethod';
import { getUrl } from '#/convertors/IncomingMessage/getUrl';
import { getBody } from '#/convertors/v3/getBody';
import { generateAxiosBody } from '#/generators/axios/generateAxiosBody';
import { generateAxiosHeader } from '#/generators/axios/generateAxiosHeader';
import { generateAxiosQuerystring } from '#/generators/axios/generateAxiosQuerystring';
import type { IAxiosRequestConfigOptions } from '#/interfaces/IAxiosRequestConfigOptions';
import type { AxiosRequestConfig } from 'axios';
import type { FastifyRequest } from 'fastify';
import type { IncomingMessage } from 'node:http';

export function createAxiosFromFastify3<T = unknown>(
  req: Pick<FastifyRequest, 'raw' | 'body'>,
  options: IAxiosRequestConfigOptions<T>,
): AxiosRequestConfig {
  const im: IncomingMessage = req.raw;

  const url = getUrl(im.url, `http://${getHost(im.headers)}`);

  const axiosReq: AxiosRequestConfig = {
    url: [url.protocol, '//', url.host, url.pathname].join(''),
    method: getMethod(im.method),
    params: generateAxiosQuerystring(url, options),
    headers: generateAxiosHeader(im.headers, options),
    data: generateAxiosBody(im.headers, getBody(req, options), options),
  };

  return axiosReq;
}
