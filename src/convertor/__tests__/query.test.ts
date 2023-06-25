import generateQuerystring from '#generator/generateQuerystring';
import encodeQuerystring from '#tools/encodeQuerystring';

describe('generate-querystring', () => {
  it('empty-querystring', () => {
    const url = new URL('https://localhost:1234');

    const qs = generateQuerystring(url, { prettify: true });

    expect(qs).toEqual('');
  });

  it('array-querystring', () => {
    const e = `${'https://localhost:1234'}?name=ironman&ability=${encodeURIComponent(
      'energy repulsor',
    )}&ability=${encodeURIComponent('supersonic flight')}`;
    const url = new URL(e);

    const qs = generateQuerystring(url, { prettify: true });

    expect(qs).toEqual('?name=ironman&ability=energy%20repulsor&ability=supersonic%20flight');
  });

  it('replacer-querystring', () => {
    const e = `${'https://localhost:1234'}?name=ironman&ability=${encodeURIComponent(
      'energy repulsor',
    )}&tid=19F88B5E-82E5-43DA-8833-D0A7FF05D17C`;
    const url = new URL(e);

    const qs = generateQuerystring(url, {
      prettify: true,
      replacer: {
        querystring: (sp) => {
          const next = new URLSearchParams(sp);
          next.set('tid', '11111111-2222-43DA-8833-D0A7FF05D17C');
          return encodeQuerystring(next);
        },
      },
    });

    expect(qs).toEqual('?name=ironman&ability=energy%20repulsor&tid=11111111-2222-43DA-8833-D0A7FF05D17C');
  });
});
