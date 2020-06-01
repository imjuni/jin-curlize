// first 2space is margin, newline after space is indent
export const defaultNewlineJoining = '  \\ \n';

export function getJoiner(indent?: number): string {
  const indentSpace = new Array(indent ?? 2)
    .fill(0)
    .map(() => ' ')
    .join('');

  return `${defaultNewlineJoining}${indentSpace}`;
}

export function withoutLastElement<T>(elements: T[]): { headings: T[]; tail?: T } {
  if (elements.length <= 1) {
    return { headings: elements, tail: undefined };
  }

  const tail = elements[elements.length - 1];
  const headings = elements.slice(undefined, -1);
  return { headings, tail };
}
