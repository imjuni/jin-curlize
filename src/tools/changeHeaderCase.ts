import toUpperCaseFirst from '#tools/toUpperCaseFirst';

export default function changeHeaderCase(key: string) {
  return key
    .split('-')
    .map((item) => toUpperCaseFirst(item))
    .join('-');
}
