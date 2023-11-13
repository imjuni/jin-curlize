import { toUpperCaseFirst } from '#/tools/toUpperCaseFirst';

export function changeHeaderCase(key: string) {
  return key
    .split('-')
    .map((item) => toUpperCaseFirst(item))
    .join('-');
}
