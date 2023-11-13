export function toUpperCaseFirst(key: string) {
  const first = key.charAt(0);
  const other = key.slice(1);
  return [first.toUpperCase(), other].join('');
}
