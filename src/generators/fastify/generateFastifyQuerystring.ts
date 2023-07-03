import type ICurlizeOptions from '#interfaces/ICurlizeOptions';

export default function generateFastifyQuerystring(url: URL, options: ICurlizeOptions): string {
  const keys = Array.from(url.searchParams.keys());

  if (keys.length <= 0) {
    return '';
  }

  const replacer = (searchParams: URLSearchParams): URLSearchParams => {
    if (options.replacer?.querystring != null) {
      return options.replacer.querystring(searchParams);
    }

    return searchParams;
  };

  const replaced = replacer(url.searchParams);

  const generated = Array.from(replaced.entries())
    .map(([key, value]) => {
      return options.replacer?.querystring != null ? `${key}=${value}` : `${key}=${encodeURIComponent(value)}`;
    })
    .join('&');

  return `?${generated}`;
}
