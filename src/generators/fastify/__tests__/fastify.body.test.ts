import { getBody } from '#/convertors/v3/getBody';
import { getContentType } from '#/convertors/v3/getContentType';
import { getDefaultMultipartFormTransformer } from '#/convertors/v3/getDefaultMultipartFormTransformer';
import { generateFastifyBody } from '#/generators/fastify/generateFastifyBody';
import qs from 'qs';
import { describe, expect, it } from 'vitest';

describe('get-content-type', () => {
  it('form-type', () => {
    const r01 = getContentType({ 'content-type': 'application/x-www-form-urlencoded' });
    expect(r01).toEqual('application/x-www-form-urlencoded');
  });

  it('json-type-1', () => {
    const r01 = getContentType({ 'content-type': 'application/json' });
    expect(r01).toEqual('application/json');
  });

  it('json-type-2', () => {
    const r01 = getContentType({});
    expect(r01).toEqual('application/json');
  });
});

describe('get-body', () => {
  it('form-type', () => {
    const body = getBody({
      raw: {
        headers: {
          host: 'http://localhost',
          'content-type': 'application/x-www-form-urlencoded',
          'access-token': 'Bearer i-am-access-token',
        },
      },
      body: { name: 'ironman' },
    });

    expect(body).toMatchObject({
      form: true,
      data: { name: 'ironman' },
    });
  });

  it('json-type', () => {
    const body = getBody({
      raw: {
        headers: {
          host: 'http://localhost',
          'access-token': 'Bearer i-am-access-token',
        },
      },
      body: { name: 'ironman' },
    });

    expect(body).toMatchObject({
      form: false,
      data: { name: 'ironman' },
    });
  });

  it('undefined', () => {
    const body = getBody({
      raw: {
        headers: {
          host: 'http://localhost',
          'access-token': 'Bearer i-am-access-token',
        },
      },
      body: undefined,
    });

    expect(body).toMatchObject({
      form: false,
    });
  });
});

describe('generateBody', () => {
  it('json-body', () => {
    const body = generateFastifyBody(
      {},
      {
        form: false,
        data: { name: 'ironman', ability: ['energy repulsor', 'supersonic flight'] },
      },
      {
        prettify: false,
      },
    );

    expect(body).toMatchObject([`--data $'{"name":"ironman","ability":["energy repulsor","supersonic flight"]}'`]);
  });

  it('json-body-replacer', () => {
    const bodyData: unknown = { name: 'ironman', ability: ['energy repulsor', 'supersonic flight'] };
    const body = generateFastifyBody(
      {},
      {
        form: false,
        data: bodyData,
      },
      {
        prettify: false,
        replacer: {
          body: (_header, data) => data,
        },
      },
    );

    expect(body).toMatchObject([`--data $'{"name":"ironman","ability":["energy repulsor","supersonic flight"]}'`]);
  });

  it('undefined-body-replacer', () => {
    try {
      const bodyData: unknown = undefined;

      const body = generateFastifyBody(
        {},
        {
          form: false,
          data: bodyData,
        },
        {
          prettify: false,
          replacer: {
            body: (_header, data) => {
              if (data == null) {
                return { name: 'ironman' };
              }

              return { ...data, name: 'ironman' };
            },
          },
        },
      );

      expect(body).toMatchObject(['--data $\'{"name":"ironman"}\'']);
    } catch (err) {
      expect(err).toBeNull();
    }
  });

  it('form-body', () => {
    const body = generateFastifyBody(
      {},
      {
        form: true,
        data: { name: 'ironman', ability: ['energy repulsor', 'supersonic flight'] },
      },
      {
        prettify: false,
      },
    );

    const d = {
      name: 'ironman',
      team: { name: 'avengers', member: 6 },
      ability: ['energy repulsor', 'supersonic flight'],
    };
    console.log(qs.stringify(d));
    console.log(qs.stringify(d).split('&'));

    expect(body).toMatchObject([`--form $'{"name":"ironman","ability":["energy repulsor","supersonic flight"]}'`]);
  });

  it('undefined-body', () => {
    const body = generateFastifyBody(
      {},
      {
        form: true,
        data: undefined,
      },
      {
        prettify: false,
      },
    );

    expect(body).toMatchObject([]);
  });
});

describe('getDefaultMultipartFormTransformer', () => {
  it('plain multipart/form-data', () => {
    const data = getDefaultMultipartFormTransformer({
      raw: {
        headers: {
          'content-type': 'multipart/form-data',
        },
      },
      body: {
        name: {
          type: 'field',
          value: 'ironman',
        },
        ability: [
          {
            type: 'field',
            value: 'energy repulsor',
          },
          {
            type: 'field',
            value: 'supersonic flight',
          },
          {
            type: 'field',
            value: 'Genius level intellect',
          },
        ],
      },
    });

    expect(data).toMatchObject({
      name: 'ironman',
      ability: ['energy repulsor', 'supersonic flight', 'Genius level intellect'],
    });
  });

  it('skip', () => {
    const data = getDefaultMultipartFormTransformer(
      {
        raw: {
          headers: {
            'content-type': 'multipart/form-data',
          },
        },
        body: {
          name: {
            type: 'field',
            value: 'ironman',
          },
          ability: [
            {
              type: 'field',
              value: 'energy repulsor',
            },
            {
              type: 'field',
              value: 'supersonic flight',
            },
          ],
        },
      },
      { replacer: { body: (_headers, bodyData) => bodyData } },
    );

    expect(data).toMatchObject({
      name: {
        type: 'field',
        value: 'ironman',
      },
      ability: [
        {
          type: 'field',
          value: 'energy repulsor',
        },
        {
          type: 'field',
          value: 'supersonic flight',
        },
      ],
    });
  });
});
