import { IRequestConvertorOptions } from '../interfaces/IRequestConvertorOptions';

export default function pathname<T>({
  convertor,
  request,
}: {
  convertor: (req: T) => string;
  request: T;
  options: IRequestConvertorOptions;
}): string | undefined {
  return convertor(request);
}
