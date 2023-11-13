import type { ICurlizeOptions } from '#/interfaces/ICurlizeOptions';

export function generateFastifyQuerystring<T = unknown>(url: URL, options: ICurlizeOptions<T>): string {
  const replacer = (searchParams: URLSearchParams): URLSearchParams => {
    if (options.replacer?.querystring != null) {
      return options.replacer.querystring(searchParams);
    }

    return searchParams;
  };

  const replaced = replacer(url.searchParams);

  if (Array.from(replaced.keys()).length <= 0) {
    return '';
  }

  const generated = Array.from(replaced.entries())
    .map(([key, value]) => {
      return options.replacer?.querystring != null ? `${key}=${value}` : `${key}=${encodeURIComponent(value)}`;
    })
    .join('&');

  return `?${generated}`;
}
