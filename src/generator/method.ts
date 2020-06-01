import { IRequestConvertorOptions } from '../interfaces/IRequestConvertorOptions';

export default function method<T>({
  convertor,
  request,
}: {
  convertor: (req: T) => string;
  request: T;
  options: IRequestConvertorOptions;
}): string | undefined {
  return `--request ${convertor(request)}`;
}
