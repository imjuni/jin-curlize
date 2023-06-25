import getMethod from '#convertor/IncomingMessage/getMethod';
import getUrl from '#convertor/IncomingMessage/getUrl';
import getIndent from '#tools/getIndent';

describe('getMethod', () => {
  it('undefined', () => {
    const r01 = getMethod(undefined);

    expect(r01).toEqual('GET');
  });

  it('get', () => {
    const r01 = getMethod('get');
    const r02 = getMethod('GET');

    expect(r01).toEqual('GET');
    expect(r02).toEqual('GET');
  });

  it('post', () => {
    const r01 = getMethod('post');
    const r02 = getMethod('POST');
    expect(r01).toEqual('POST');
    expect(r02).toEqual('POST');
  });

  it('put', () => {
    const r01 = getMethod('put');
    const r02 = getMethod('PUT');
    expect(r01).toEqual('PUT');
    expect(r02).toEqual('PUT');
  });

  it('delete', () => {
    const r01 = getMethod('delete');
    const r02 = getMethod('DELETE');
    expect(r01).toEqual('DELETE');
    expect(r02).toEqual('DELETE');
  });

  it('patch', () => {
    const r01 = getMethod('patch');
    const r02 = getMethod('PATCH');
    expect(r01).toEqual('PATCH');
    expect(r02).toEqual('PATCH');
  });

  it('head', () => {
    const r01 = getMethod('head');
    const r02 = getMethod('HEAD');
    expect(r01).toEqual('HEAD');
    expect(r02).toEqual('HEAD');
  });

  it('options', () => {
    const r01 = getMethod('options');
    const r02 = getMethod('OPTIONS');
    expect(r01).toEqual('OPTIONS');
    expect(r02).toEqual('OPTIONS');
  });

  it('uknown', () => {
    const r01 = getMethod('1');
    const r02 = getMethod('GET');
    expect(r01).toEqual('GET');
    expect(r02).toEqual('GET');
  });
});

describe('getUrl', () => {
  it('null', () => {
    expect(() => {
      getUrl(undefined, '');
    }).toThrow(Error);
  });

  it('pass', () => {
    const url = '/marvel/ironman/cool';
    const r = getUrl(url, 'https://localhost:3000');

    expect(r.href).toEqual('https://localhost:3000/marvel/ironman/cool');
    expect(r.pathname).toEqual('/marvel/ironman/cool');
  });
});

describe('getIndent', () => {
  it('2-space', () => {
    const indent = getIndent({ prettify: true });
    expect(indent).toEqual('  ');
  });

  it('2-space', () => {
    const indent = getIndent({ prettify: true, indent: 3 });
    expect(indent).toEqual('   ');
  });

  it('no-indent', () => {
    const indent = getIndent({ prettify: false });
    expect(indent).toEqual('');
  });
});
