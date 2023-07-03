/* eslint-disable @typescript-eslint/no-unsafe-return */
import getBody from '#convertors/v3/getBody';
import getContentType from '#convertors/v3/getContentType';
import getDefaultMultipartFormTransformer from '#convertors/v3/getDefaultMultipartFormTransformer';
import generateAxiosBody from '#generators/axios/generateAxiosBody';

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
    const body = generateAxiosBody(
      {},
      {
        form: false,
        data: { name: 'ironman', ability: ['energy repulsor', 'supersonic flight'] },
      },
    );

    expect(body).toMatchObject({ name: 'ironman', ability: ['energy repulsor', 'supersonic flight'] });
  });

  it('json-body+replacer', () => {
    const body = generateAxiosBody(
      {},
      {
        form: false,
        data: { name: 'ironman', ability: ['energy repulsor', 'supersonic flight'] },
      },
      {
        replacer: {
          body: (_header, data: Record<string, string | string[]>) => {
            const name = `${data.name as string}+iambigfan`;
            return { ...data, name };
          },
        },
      },
    );

    expect(body).toMatchObject({ name: 'ironman+iambigfan', ability: ['energy repulsor', 'supersonic flight'] });
  });

  it('form-body', () => {
    const body = generateAxiosBody(
      {},
      {
        form: true,
        data: { name: 'ironman', ability: ['energy repulsor', 'supersonic flight'] },
      },
    );

    expect(body).toEqual('name=ironman&ability=energy%20repulsor&ability=supersonic%20flight');
  });

  it('undefined-body', () => {
    const body = generateAxiosBody(
      {},
      {
        form: true,
        data: undefined,
      },
    );

    expect(body).toBeUndefined();
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
