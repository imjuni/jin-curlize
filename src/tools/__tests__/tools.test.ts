import changeHeaderCase from '#tools/changeHeaderCase';
import getIndent from '#tools/getIndent';
import toUpperCaseFirst from '#tools/toUpperCaseFirst';

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

describe('toUpperCaseFirst', () => {
  it('pass', () => {
    const r01 = toUpperCaseFirst('hello');
    expect(r01).toEqual('Hello');
  });
});

describe('changeHeaderCase', () => {
  it('pass', () => {
    const r01 = changeHeaderCase('content-type');
    expect(r01).toEqual('Content-Type');
  });
});
