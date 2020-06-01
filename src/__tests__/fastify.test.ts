import debug from 'debug';
import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import createByfastify3 from '../createByfastify3';
import axios from 'axios';

const log = debug('jcurlize:fastify-test');

let server: FastifyInstance;
const port = 33327;

describe('jincurl.test', () => {
  beforeAll(async () => {
    const option: FastifyServerOptions = {
      ignoreTrailingSlash: true,
    };

    log('서버시작');
    server = fastify(option);

    server.get('/curlize', (req, reply) => {
      const setUuid = Boolean(req.headers['set-uuid']);
      const setPrettify = Boolean(req.headers['set-prettify']);

      const curlCmd = createByfastify3(req, {
        prettify: setPrettify,
        uuid: setUuid ? { command: 'uuidgen', paramName: 'tid' } : undefined,
      });

      reply.send(curlCmd);
    });

    await server.listen(port);
  });

  test('fastify-request-with-uuid', async () => {
    const resp = await axios.request({ url: `http://localhost:${port}/curlize`, headers: { 'set-uuid': true } });

    log('test-with-uuid: ', resp.data);

    expect(resp.data).toEqual(
      `curl 'http://localhost:33327/curlize?tid=$(uuidgen)' --request GET --location --header 'set-uuid: true'`,
    );
  });

  test('fastify-request-with-prettify', async () => {
    const resp = await axios.request({
      url: `http://localhost:${port}/curlize?param01=param01&param02=param02&param03=param03&param04=param04`,
      headers: { 'set-prettify': true },
    });

    log('test-with-prettify: ', resp.data);

    expect(resp.data).toEqual(
      `curl 'http://localhost:33327/curlize  \\ 
  ?param01=param01  \\ 
  &param02=param02  \\ 
  &param03=param03  \\ 
  &param04=param04' \\ 
  --request GET \\ 
  --location \\ 
  --header 'set-prettify: true'`,
    );
  });

  test('fastify-request-with-prettify-uuid', async () => {
    const resp = await axios.request({
      url: `http://localhost:${port}/curlize?param01=param01&param02=param02&param03=param03&param04=param04`,
      headers: {
        'set-prettify': true,
        'set-uuid': true,
      },
    });

    log('test-with-prettify: ', resp.data);

    expect(resp.data).toEqual(
      `curl 'http://localhost:33327/curlize  \\ 
  ?param01=param01  \\ 
  &param02=param02  \\ 
  &param03=param03  \\ 
  &param04=param04  \\ 
  &tid=$(uuidgen)' \\ 
  --request GET \\ 
  --location \\ 
  --header 'set-prettify: true'  \\ 
  --header 'set-uuid: true'`,
    );
  });

  afterAll(async () => {
    server.close();
    log('서버종료');
  });
});
