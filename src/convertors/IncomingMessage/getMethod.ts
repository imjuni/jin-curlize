export function getMethod(method: string | undefined): string {
  const next = (method ?? 'GET').toUpperCase();

  switch (next) {
    case 'GET':
      return 'GET';
    case 'POST':
      return 'POST';
    case 'PUT':
      return 'PUT';
    case 'DELETE':
      return 'DELETE';
    case 'PATCH':
      return 'PATCH';
    case 'HEAD':
      return 'HEAD';
    case 'OPTIONS':
      return 'OPTIONS';
    default:
      return 'GET';
  }
}
