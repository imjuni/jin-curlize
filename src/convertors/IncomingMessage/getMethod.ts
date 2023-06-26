export default function getMethod(method: string | undefined): string {
  const next = (method ?? 'GET').toUpperCase();

  if (next === 'GET') {
    return 'GET';
  }

  if (next === 'POST') {
    return 'POST';
  }

  if (next === 'PUT') {
    return 'PUT';
  }

  if (next === 'DELETE') {
    return 'DELETE';
  }

  if (next === 'PATCH') {
    return 'PATCH';
  }

  if (next === 'HEAD') {
    return 'HEAD';
  }

  if (next === 'OPTIONS') {
    return 'OPTIONS';
  }

  return 'GET';
}
