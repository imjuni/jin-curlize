import { TJSONValue } from '../interfaces/TJSONValue';
import { IRequestConvertorOptions } from '../interfaces/IRequestConvertorOptions';
import { isEmpty } from 'my-easy-fp';
import fastStringify from 'fast-stringify';
import ll from '../ll';

const log = ll('jcurlize', __filename);

export default function body<T>({
  convertor,
  request,
  options,
}: {
  convertor: (req: T) => { form: boolean; data: TJSONValue };
  request: T;
  options: IRequestConvertorOptions;
}): string | undefined {
  try {
    const converted = convertor(request);

    if (isEmpty(converted) || isEmpty(converted.data)) {
      return undefined;
    }

    // application/x-www-form-urlencoded 방식인가 아닌가
    const command = converted.form
      ? `${Object.entries(converted.data)
          .map<Array<[string, string]>>(([key, values]) => {
            return Array.isArray(values) ? values.map((value) => [key, value]) : [[key, values]];
          })
          .flatMap((value) => value)
          .map(([key, value]) => `${key}=${value}`)
          .join(options.prettify ? '  \\ \n' : '')}`
      : `${
          options.prettify
            ? `--data $'${fastStringify(converted.data, undefined, options.indent ?? 2)}'`
            : `--data $'${fastStringify(converted.data)}'`
        }`;

    return command;
  } catch (err) {
    log(err.message);
    log(err.stack);

    return undefined;
  }
}
