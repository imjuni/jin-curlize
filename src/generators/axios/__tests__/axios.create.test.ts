import { createAxiosFromFastify3 } from '#/convertors/v3/createAxiosFromFastify3';
import fastifyFormbody from '@fastify/formbody';
import fastifyMultipart from '@fastify/multipart';
import axios from 'axios';
import fastify, { type FastifyInstance, type FastifyServerOptions } from 'fastify';
import FormData from 'form-data';
import { isError, parseBool } from 'my-easy-fp';
import querystring from 'node:querystring';
import portfinder from 'portfinder';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const context: {
  server: FastifyInstance;
  port: number;
} = {} as any;

describe('create', () => {
  beforeAll(async () => {
    const option: FastifyServerOptions = {
      ignoreTrailingSlash: true,
    };

    console.log('start fastify server');
    context.port = await portfinder.getPortPromise({ port: 35000, stopPort: 60000 });
    context.server = fastify(option);

    context.server.register(fastifyFormbody);
    context.server.register(fastifyMultipart, {
      attachFieldsToBody: true,
      throwFileSizeLimit: true,
      limits: {
        fileSize: 1 * 1024 * 1024 * 1024, // 1mb limits
        files: 2,
      },
      sharedSchemaId: 'fileUploadSchema',
    });

    context.server.get('/curlize', (req, reply) => {
      const changeHeaderKey = parseBool(req.headers['change-header-key'] ?? false);
      const axiosReq = createAxiosFromFastify3(req, { changeHeaderKey });

      reply.send(axiosReq);
    });

    context.server.post('/post-form', {}, (req, reply) => {
      const changeHeaderKey = parseBool(req.headers['change-header-key'] ?? false);
      const axiosReq = createAxiosFromFastify3(req, { changeHeaderKey });

      reply.send(axiosReq);
    });

    await context.server
      .listen({ port: context.port, host: '127.0.0.1' })
      .then(() => {
        console.log('server start');
      })
      .catch((caught) => {
        const err = isError(caught, new Error('unknown error raised'));
        console.error(err.message);
        console.error(err.stack);
      });
  });

  it('get', async () => {
    const resp = await axios.request({
      url: `http://localhost:${context.port}/curlize`,
      headers: { 'set-uuid': true },
    });

    console.log('get: ', resp.data);

    expect(resp.data).toMatchObject({
      headers: { 'set-uuid': 'true' },
      method: 'GET',
      url: `http://localhost:${context.port}/curlize`,
    });
  });

  it('get - change-header-key', async () => {
    const resp = await axios.request({
      url: `http://localhost:${context.port}/curlize`,
      headers: { 'change-header-key': 'true' },
    });

    console.log('get: ', resp.data);

    expect(resp.data).toMatchObject({
      headers: { 'Change-Header-Key': 'true' },
      method: 'GET',
      url: `http://localhost:${context.port}/curlize`,
    });
  });

  it('post-form-urlencoded', async () => {
    const resp = await axios.request({
      method: 'post',
      url: `http://localhost:${context.port}/post-form`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: querystring.stringify({
        name: 'ironman',
        ability: ['energy repulsor', 'supersonic flight'],
      }),
    });

    console.log('post-form: ', resp.data);

    expect(resp.data).toMatchObject({
      method: 'POST',
      url: `http://localhost:${context.port}/post-form`,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: 'name=ironman&ability=energy%20repulsor&ability=supersonic%20flight',
    });

    const resp2 = await axios.request({
      method: 'POST',
      url: `http://localhost:${context.port}/post-form`,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: 'name=ironman&ability=energy%20repulsor&ability=supersonic%20flight',
    });

    expect(resp2.data).toMatchObject({
      method: 'POST',
      url: `http://localhost:${context.port}/post-form`,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: 'name=ironman&ability=energy%20repulsor&ability=supersonic%20flight',
    });
  });

  it('post-form-multipart', async () => {
    const formData = new FormData();

    formData.append('name', 'ironman');
    formData.append('ability', 'energy repulsor');
    formData.append('ability', 'supersonic flight');

    const resp = await axios.request({
      method: 'post',
      url: `http://localhost:${context.port}/post-form`,
      data: formData,
    });

    console.log('post-form: ', resp.data);

    expect(resp.data).toMatchObject({
      url: `http://localhost:${context.port}/post-form`,
      method: 'POST',
      headers: {
        'content-type': 'multipart/form-data',
      },
      data: 'name=ironman&ability=energy%20repulsor&ability=supersonic%20flight',
    });
  });

  it('post-form-json', async () => {
    const resp = await axios.request({
      method: 'post',
      url: `http://localhost:${context.port}/post-form`,
      data: {
        name: 'ironman',
        ability: ['energy repulsor', 'supersonic flight'],
      },
    });

    console.log('post-form: ', resp.data);

    expect(resp.data).toMatchObject({
      url: `http://localhost:${context.port}/post-form`,
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      data: {
        name: 'ironman',
        ability: ['energy repulsor', 'supersonic flight'],
      },
    });
  });

  it('post-form-urlencoded-prettify', async () => {
    const resp = await axios.request({
      method: 'post',
      url: `http://localhost:${context.port}/post-form`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', prettify: 'true' },
      data: querystring.stringify({
        name: 'ironman',
        ability: ['energy repulsor', 'supersonic flight'],
      }),
    });

    console.log('post-form: ', resp.data);

    expect(resp.data).toMatchObject({
      url: `http://localhost:${context.port}/post-form`,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        prettify: 'true',
      },
      data: 'name=ironman&ability=energy%20repulsor&ability=supersonic%20flight',
    });
  });

  afterAll(async () => {
    context.server.close();
    console.log('close fastify server');
  });
});
