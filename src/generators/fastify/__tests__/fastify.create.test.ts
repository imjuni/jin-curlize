/* eslint-disable @typescript-eslint/no-floating-promises */
import createFromFastify3 from '#convertors/v3/createFromFastify3';
import fastifyFormbody from '@fastify/formbody';
import fastifyMultipart from '@fastify/multipart';
import axios from 'axios';
import fastify, { type FastifyInstance, type FastifyServerOptions } from 'fastify';
import FormData from 'form-data';
import { isError, parseBool } from 'my-easy-fp';
import querystring from 'node:querystring';

let server: FastifyInstance;
const port = 33327;

describe('create', () => {
  beforeAll(async () => {
    const option: FastifyServerOptions = {
      ignoreTrailingSlash: true,
    };

    console.log('start fastify server');
    server = fastify(option);

    server.register(fastifyFormbody);
    server.register(fastifyMultipart, {
      attachFieldsToBody: true,
      throwFileSizeLimit: true,
      limits: {
        fileSize: 1 * 1024 * 1024 * 1024, // 1mb limits
        files: 2,
      },
      sharedSchemaId: 'fileUploadSchema',
    });

    server.get('/curlize', (req, reply) => {
      const prettify = parseBool(req.headers.prettify);
      const disableFollowRedirect = parseBool(req.headers['disable-follow-redirect'] ?? true);
      const curlCmd = createFromFastify3(req, { prettify, disableFollowRedirect });

      reply.send(curlCmd);
    });

    server.post('/post-form', {}, (req, reply) => {
      const prettify = parseBool(req.headers.prettify);
      const curlCmd = createFromFastify3(req, { prettify });

      reply.send(curlCmd);
    });

    await server
      .listen({ port })
      .then(() => {
        console.log('server start');
      })
      .catch((caught) => {
        const err = isError(caught, new Error('unknown error raised'));
        console.error(err.message);
        console.error(err.stack);
      });
  });

  test('get', async () => {
    const resp = await axios.request({ url: `http://localhost:${port}/curlize`, headers: { 'set-uuid': true } });

    console.log('get: ', resp.data);

    expect(resp.data).toEqual(`curl -X GET 'http://localhost:33327/curlize' --header 'set-uuid: true'`);
  });

  test('get - disable-follow-redirect', async () => {
    const resp = await axios.request({
      url: `http://localhost:${port}/curlize`,
      headers: { 'disable-follow-redirect': 'false' },
    });

    console.log('get: ', resp.data);

    expect(resp.data).toEqual(
      `curl -X GET 'http://localhost:33327/curlize' --location --header 'disable-follow-redirect: false'`,
    );
  });

  test('post-form-urlencoded', async () => {
    const resp = await axios.request({
      method: 'post',
      url: `http://localhost:${port}/post-form`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: querystring.stringify({
        name: 'ironman',
        ability: ['energy repulsor', 'supersonic flight'],
      }),
    });

    console.log('post-form: ', resp.data);

    expect(resp.data).toEqual(
      `curl -X POST 'http://localhost:33327/post-form' --header 'content-type: application/x-www-form-urlencoded' --form $'{"name":"ironman","ability":["energy repulsor","supersonic flight"]}'`,
    );
  });

  test('post-form-multipart', async () => {
    const formData = new FormData();

    formData.append('name', 'ironman');
    formData.append('ability', 'energy repulsor');
    formData.append('ability', 'supersonic flight');

    const resp = await axios.request({
      method: 'post',
      url: `http://localhost:${port}/post-form`,
      data: formData,
    });

    console.log('post-form: ', resp.data);

    expect(resp.data).toEqual(
      `curl -X POST 'http://localhost:33327/post-form' --header 'content-type: multipart/form-data' --form $'{"name":"ironman","ability":["energy repulsor","supersonic flight"]}'`,
    );
  });

  test('post-form-json', async () => {
    const resp = await axios.request({
      method: 'post',
      url: `http://localhost:${port}/post-form`,
      data: {
        name: 'ironman',
        ability: ['energy repulsor', 'supersonic flight'],
      },
    });

    console.log('post-form: ', resp.data);

    expect(resp.data).toEqual(
      `curl -X POST 'http://localhost:33327/post-form' --header 'content-type: application/json' --data $'{"name":"ironman","ability":["energy repulsor","supersonic flight"]}'`,
    );
  });

  test('post-form-urlencoded-prettify', async () => {
    const resp = await axios.request({
      method: 'post',
      url: `http://localhost:${port}/post-form`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', prettify: 'true' },
      data: querystring.stringify({
        name: 'ironman',
        ability: ['energy repulsor', 'supersonic flight'],
      }),
    });

    console.log('post-form: ', resp.data);

    const e = `curl \\
  -X POST 'http://localhost:33327/post-form' \\
  --header 'content-type: application/x-www-form-urlencoded' \\
  --header 'prettify: true' \\
  --form $'{"name":"ironman","ability":["energy repulsor","supersonic flight"]}'`;

    expect(resp.data).toEqual(e);
  });

  afterAll(async () => {
    server.close();
    console.log('close fastify server');
  });
});
