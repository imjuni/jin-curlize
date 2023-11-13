import { generateAxiosQuerystring } from '#/generators/axios/generateAxiosQuerystring';
import { encodeQuerystring } from '#/tools/encodeQuerystring';
import { describe, expect, it } from 'vitest';

describe('generate-querystring', () => {
  it('empty-querystring', () => {
    const url = new URL('https://localhost:1234');

    const qs = generateAxiosQuerystring(url);

    expect(qs).toBeUndefined();
  });

  it('array-querystring', () => {
    const e = `${'https://localhost:1234'}?name=ironman&ability=${encodeURIComponent(
      'energy repulsor',
    )}&ability=${encodeURIComponent('supersonic flight')}`;
    const url = new URL(e);

    const qs = generateAxiosQuerystring(url);

    expect(qs).toMatchObject({ name: 'ironman', ability: ['energy repulsor', 'supersonic flight'] });
  });

  it('replacer-querystring', () => {
    const e = `${'https://localhost:1234'}?name=ironman&ability=${encodeURIComponent(
      'energy repulsor',
    )}&tid=19F88B5E-82E5-43DA-8833-D0A7FF05D17C`;
    const url = new URL(e);

    const qs = generateAxiosQuerystring(url, {
      replacer: {
        querystring: (sp) => {
          const next = new URLSearchParams(sp);
          next.set('tid', '11111111-2222-43DA-8833-D0A7FF05D17C');
          return encodeQuerystring(next);
        },
      },
    });

    expect(qs).toMatchObject({
      ability: 'energy%20repulsor',
      name: 'ironman',
      tid: '11111111-2222-43DA-8833-D0A7FF05D17C',
    });
  });
});
