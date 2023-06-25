import getBody from '#convertor/v3/getBody';
import getContentType from '#convertor/v3/getContentType';
import getDefaultMultipartFormTransformer from '#convertor/v3/getDefaultMultipartFormTransformer';
import generateBody from '#generator/generateBody';

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
    const body = getBody(
      {
        raw: {
          headers: {
            host: 'http://localhost',
            'content-type': 'application/x-www-form-urlencoded',
            'access-token': 'Bearer i-am-access-token',
          },
        },
        body: { name: 'ironman' },
      },
      {
        prettify: true,
      },
    );

    expect(body).toMatchObject({
      form: true,
      data: { name: 'ironman' },
    });
  });

  it('json-type', () => {
    const body = getBody(
      {
        raw: {
          headers: {
            host: 'http://localhost',
            'access-token': 'Bearer i-am-access-token',
          },
        },
        body: { name: 'ironman' },
      },
      {
        prettify: true,
      },
    );

    expect(body).toMatchObject({
      form: false,
      data: { name: 'ironman' },
    });
  });

  it('undefined', () => {
    const body = getBody(
      {
        raw: {
          headers: {
            host: 'http://localhost',
            'access-token': 'Bearer i-am-access-token',
          },
        },
        body: undefined,
      },
      {
        prettify: true,
      },
    );

    expect(body).toMatchObject({
      form: false,
    });
  });
});

describe('generateBody', () => {
  it('json-body', () => {
    const body = generateBody(
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

  it('form-body', () => {
    const body = generateBody(
      {
        form: true,
        data: { name: 'ironman', ability: ['energy repulsor', 'supersonic flight'] },
      },
      {
        prettify: false,
      },
    );

    expect(body).toMatchObject([
      `--data name='ironman'`,
      `--data ability='energy repulsor'`,
      `--data ability='supersonic flight'`,
    ]);
  });

  it('undefined-body', () => {
    const body = generateBody(
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
            {
              type: 'field',
              value: 'Genius level intellect',
            },
          ],
        },
      },
      { prettify: true },
    );

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
      { prettify: true, replacer: { body: (_headers, bodyData) => bodyData } },
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
