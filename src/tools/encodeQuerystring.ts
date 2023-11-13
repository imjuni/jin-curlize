export function encodeQuerystring(sp: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams(sp);

  Array.from(sp.entries()).forEach(([key, value]) => {
    next.set(key, encodeURIComponent(value));
  });

  return next;
}
