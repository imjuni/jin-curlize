import crypto from 'crypto';
import fastify from 'fastify';
import { createFromFastify3 } from 'jin-curlize';

const server = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
    },
    serializers: {
      res(reply) {
        return {
          statusCode: reply.statusCode,
        };
      },
      req(request) {
        const curlCmd = createFromFastify3(request, {
          prettify: false,
          replacer: {
            header: (header) => {
              header['x-request-id'] = crypto.randomUUID();
              return header;
            },
          },
        });

        return {
          method: request.method,
          url: request.url,
          path: request.routerPath,
          parameters: request.params,
          headers: request.headers,
          curl: curlCmd,
        };
      },
    },
  },
});

server.get('/hello', () => {
  return {
    name: 'ironman',
    greeting: 'hello',
  };
});

server.listen({ port: 33991 });
