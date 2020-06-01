import { FastifyRequest } from 'fastify';
import {
  fastifyBodyConvertor,
  fastifyHeaderConvertor,
  fastifyMethodConvertor,
  fastifyPathConvertor,
  fastifyQueryConvertor,
} from './convertor/fastify';
import body from './generator/body';
import header from './generator/header';
import method from './generator/method';
import pathname from './generator/pathname';
import querystring from './generator/querystring';
import { IRequestConvertorOptions } from './interfaces/IRequestConvertorOptions';
import { getJoiner } from './tools';

export default function createByfastify3(request: FastifyRequest, options: IRequestConvertorOptions): string {
  const joiner = getJoiner(options.indent);

  const command = [
    `curl '${pathname({ request, convertor: fastifyPathConvertor, options })}${
      querystring({
        request,
        convertor: fastifyQueryConvertor,
        options,
      }) ?? ''
    }'`,
    `${method({
      request,
      convertor: fastifyMethodConvertor,
      options,
    })}`,
    options.disableFollowRedirect ?? false ? '' : '--location',
    `${header({ request, convertor: fastifyHeaderConvertor, options }) ?? ''}`,
    `${
      body({
        request,
        convertor: fastifyBodyConvertor,
        options,
      }) ?? ''
    }`,
  ]
    .filter((part) => part !== '')
    .join(options.prettify ? joiner : ' ');

  return command;
}
