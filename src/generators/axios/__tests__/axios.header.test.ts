import { generateAxiosHeader } from '#/generators/axios/generateAxiosHeader';
import { defaultHeaderFilterItems } from '#/tools/defaultHeaderFilterItems';
import type { IncomingHttpHeaders } from 'node:http';
import { describe, expect, it } from 'vitest';

describe('generate-header', () => {
  it('string-type', () => {
    const header = generateAxiosHeader({
      host: 'http://localhost',
      'content-type': 'application/x-www-form-urlencoded',
      'access-token': 'Bearer i-am-access-token',
    });

    expect(header).toEqual({
      'access-token': 'Bearer i-am-access-token',
      'content-type': 'application/x-www-form-urlencoded',
    });
  });

  it('string-type refine-header-additional-field', () => {
    const header = generateAxiosHeader({
      host: 'http://localhost',
      'content-type': 'multipart/form-data; boundary=--------------------------567807848329877144365887',
      'access-token': 'Bearer i-am-access-token',
    });

    expect(header).toEqual({
      'access-token': 'Bearer i-am-access-token',
      'content-type': 'multipart/form-data',
    });
  });

  it('string-type refine-header-undefined', () => {
    const header = generateAxiosHeader({
      host: 'http://localhost',
      'content-type': undefined,
      'access-token': 'Bearer i-am-access-token',
    });

    expect(header).toEqual({ 'access-token': 'Bearer i-am-access-token' });
  });

  it('string[]-type', () => {
    const header = generateAxiosHeader({
      host: 'http://localhost',
      'content-type': 'application/x-www-form-urlencoded',
      'access-token': 'Bearer i-am-access-token',
      referers: ['http://site1', 'http://site2'],
    });

    expect(header).toEqual({
      'access-token': 'Bearer i-am-access-token',
      'content-type': 'application/x-www-form-urlencoded',
      referers: ['http://site1', 'http://site2'],
    });
  });

  it('string[]-type+array', () => {
    const header = generateAxiosHeader({
      host: 'http://localhost',
      'content-type': 'application/x-www-form-urlencoded',
      'access-token': 'Bearer i-am-access-token',
      referers: ['http://site1', 'http://site2'],
      user: undefined,
    });

    expect(header).toEqual({
      'access-token': 'Bearer i-am-access-token',
      'content-type': 'application/x-www-form-urlencoded',
      referers: ['http://site1', 'http://site2'],
    });
  });

  it('string[]-type+array+error-content-type', () => {
    const header = generateAxiosHeader({
      host: 'http://localhost',
      'content-type': 'application/x-www-form-urlencoded',
      'access-token': 'Bearer i-am-access-token',
      referers: ['http://site1', 'http://site2'],
    });

    expect(header).toEqual({
      'access-token': 'Bearer i-am-access-token',
      'content-type': 'application/x-www-form-urlencoded',
      referers: ['http://site1', 'http://site2'],
    });
  });

  it('string[]-type+array+changeHeaderKey', () => {
    const header = generateAxiosHeader(
      {
        host: 'http://localhost',
        'content-type': 'application/x-www-form-urlencoded',
        'access-token': 'Bearer i-am-access-token',
        referers: ['http://site1', 'http://site2'],
        user: undefined,
      },
      { changeHeaderKey: true },
    );

    expect(header).toEqual({
      'Access-Token': 'Bearer i-am-access-token',
      'Content-Type': 'application/x-www-form-urlencoded',
      Referers: ['http://site1', 'http://site2'],
    });
  });

  it('replacer-string[]-type+array', () => {
    const header = generateAxiosHeader(
      {
        host: 'http://localhost',
        'content-type': 'application/x-www-form-urlencoded',
        'access-token': 'Bearer i-am-access-token',
        referers: ['http://site1', 'http://site2'],
        user: undefined,
      },
      {
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

    expect(header).toEqual({
      'access-token': 'Bearer i-am-access-token',
      'content-type': 'application/x-www-form-urlencoded',
      referers: ['http://site1', 'http://site2'],
    });
  });
});
