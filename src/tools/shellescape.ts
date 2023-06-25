/**
 * return a shell compatible format
 * from: https://www.npmjs.com/package/shell-escape
 * @param inp
 * @returns
 */
export default function shellescape(inp: string[]): string {
  const ret = inp.map((item: string) => {
    let next = item;

    if (/[^A-Za-z0-9_/:=-]/.test(item)) {
      next = `'${next.replace(/'/g, "'\\''")}'`;
      next = next
        .replace(/^(?:'')+/g, '') // unduplicate single-quote at the beginning
        .replace(/\\'''/g, "\\'"); // remove non-escaped single-quote if there are enclosed between 2 escaped
    }

    return next;
  });

  return ret.join(' ');
}
