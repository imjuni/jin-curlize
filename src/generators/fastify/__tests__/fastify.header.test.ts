import { generateFastifyHeader } from '#/generators/fastify/generateFastifyHeader';
import { defaultHeaderFilterItems } from '#/tools/defaultHeaderFilterItems';
import type { IncomingHttpHeaders } from 'node:http';
import { describe, expect, it } from 'vitest';

describe('generate-header', () => {
  it('string-type', () => {
    const header = generateFastifyHeader(
      {
        host: 'http://localhost',
        'content-type': 'application/x-www-form-urlencoded',
        'access-token': 'Bearer i-am-access-token',
      },
      { prettify: true },
    );

    expect(header).toEqual([
      `  --header 'content-type: application/x-www-form-urlencoded'`,
      `  --header 'access-token: Bearer i-am-access-token'`,
    ]);
  });

  it('string-type refine-header-additional-field', () => {
    const header = generateFastifyHeader(
      {
        host: 'http://localhost',
        'content-type': 'multipart/form-data; boundary=--------------------------567807848329877144365887',
        'access-token': 'Bearer i-am-access-token',
      },
      { prettify: true },
    );

    expect(header).toEqual([
      `  --header 'content-type: multipart/form-data'`,
      `  --header 'access-token: Bearer i-am-access-token'`,
    ]);
  });

  it('string-type refine-header-undefined', () => {
    const header = generateFastifyHeader(
      {
        host: 'http://localhost',
        'content-type': undefined,
        'access-token': 'Bearer i-am-access-token',
      },
      { prettify: true },
    );

    expect(header).toEqual([
      `  --header 'content-type: application/json'`,
      `  --header 'access-token: Bearer i-am-access-token'`,
    ]);
  });

  it('string[]-type', () => {
    const header = generateFastifyHeader(
      {
        host: 'http://localhost',
        'content-type': 'application/x-www-form-urlencoded',
        'access-token': 'Bearer i-am-access-token',
        referers: ['http://site1', 'http://site2'],
      },
      { prettify: true },
    );

    expect(header).toEqual([
      `  --header 'content-type: application/x-www-form-urlencoded'`,
      `  --header 'access-token: Bearer i-am-access-token'`,
      `  --header 'referers: http://site1,http://site2'`,
    ]);
  });

  it('string[]-type+array', () => {
    const header = generateFastifyHeader(
      {
        host: 'http://localhost',
        'content-type': 'application/x-www-form-urlencoded',
        'access-token': 'Bearer i-am-access-token',
        referers: ['http://site1', 'http://site2'],
        user: undefined,
      },
      { prettify: false },
    );

    expect(header).toEqual([
      `--header 'content-type: application/x-www-form-urlencoded'`,
      `--header 'access-token: Bearer i-am-access-token'`,
      `--header 'referers: http://site1,http://site2'`,
      `--header 'user:  '`,
    ]);
  });

  it('string[]-type+array+changeHeaderKey', () => {
    const header = generateFastifyHeader(
      {
        host: 'http://localhost',
        'content-type': 'application/x-www-form-urlencoded',
        'access-token': 'Bearer i-am-access-token',
        referers: ['http://site1', 'http://site2'],
        user: undefined,
      },
      { prettify: false, changeHeaderKey: true },
    );

    expect(header).toEqual([
      `--header 'Content-Type: application/x-www-form-urlencoded'`,
      `--header 'Access-Token: Bearer i-am-access-token'`,
      `--header 'Referers: http://site1,http://site2'`,
      `--header 'User:  '`,
    ]);
  });

  it('replacer-string[]-type+array', () => {
    const header = generateFastifyHeader(
      {
        host: 'http://localhost',
        'content-type': 'application/x-www-form-urlencoded',
        'access-token': 'Bearer i-am-access-token',
        referers: ['http://site1', 'http://site2'],
        user: undefined,
      },
      {
        prettify: false,
        replacer: {
          header: (imh: IncomingHttpHeaders) => {
            const next = Object.entries(imh)
              .filter(([key]) => !(defaultHeaderFilterItems as readonly string[]).includes(key.trim().toLowerCase()))
              .reduce<IncomingHttpHeaders>((agg, [key, value]) => {
                return { ...agg, [key]: value };
              }, {});

            delete next.user;
            return next;
          },
        },
      },
    );

    expect(header).toEqual([
      `--header 'content-type: application/x-www-form-urlencoded'`,
      `--header 'access-token: Bearer i-am-access-token'`,
      `--header 'referers: http://site1,http://site2'`,
    ]);
  });

  it('replacer-string[]-type+array', () => {
    const header = generateFastifyHeader(
      {
        host: 'http://localhost',
        'content-type': 'application/x-www-form-urlencoded',
        'access-token': 'Bearer i-am-access-token',
        referers: ['http://site1', 'http://site2'],
        user: undefined,
      },
      {
        prettify: false,
        replacer: {
          header: (imh: IncomingHttpHeaders) => {
            if (imh.user == null) {
              throw new Error('nullable user');
            }

            const next = Object.entries(imh)
              .filter(([key]) => !(defaultHeaderFilterItems as readonly string[]).includes(key.trim().toLowerCase()))
              .reduce<IncomingHttpHeaders>((agg, [key, value]) => {
                return { ...agg, [key]: value };
              }, {});

            delete next.user;
            return next;
          },
        },
      },
    );

    expect(header).toEqual([
      `--header 'content-type: application/x-www-form-urlencoded'`,
      `--header 'access-token: Bearer i-am-access-token'`,
      `--header 'referers: http://site1,http://site2'`,
      `--header 'user:  '`,
    ]);
  });
});
