import { FastifyRequest } from 'fastify';
import castor from '../castor';
import { TJSONValue } from '../interfaces/TJSONValue';

export function fastifyPathConvertor(req: FastifyRequest): string {
  return `${req.protocol}://${req.hostname}${req.routerPath}`;
}

export function fastifyMethodConvertor(req: FastifyRequest): string {
  return req.method;
}

export function fastifyQueryConvertor(req: FastifyRequest): { [key: string]: string | string[] } | undefined {
  try {
    return castor(req.query);
  } catch (err) {
    return undefined;
  }
}

export function fastifyBodyConvertor(req: FastifyRequest): { form: boolean; data: TJSONValue } {
  try {
    if ((req.headers['content-type']?.toLowerCase() ?? 'application/json') === 'application/x-www-form-urlencoded') {
      return { form: true, data: castor(req.body) };
    }

    return { form: false, data: castor(req.body) };
  } catch (err) {
    return { form: false, data: undefined };
  }
}

export function fastifyHeaderConvertor(req: FastifyRequest): { [key: string]: string | string[] } | undefined {
  try {
    return castor(req.raw.headers);
  } catch (err) {
    return undefined;
  }
}
