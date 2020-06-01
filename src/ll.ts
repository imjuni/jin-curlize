import debug from 'debug';
import * as path from 'path';

/**
 * 사용하지 말것, debug는 정말 편리한 도구라서 개발할 때 활용하기 정말 좋지만 이를 사용하기 시작하면 결국 winston 로그는
 * 로그를 반드시 산출해야 하는 상황이 아니면 사용하지 않게 되어 거의 버려지는 수준이 되어버린다. 정말 기계적으로 로그를 산출하는 것
 * 이외 용도로는 거의 사용하지 않게 된다. 그래서 이번에는 debug를 아예 버리고, winston으로 통합해서 로그를 작성한다.
 *
 * @param channel 채널
 */
export default function ll(channel: string, filename: string): debug.IDebugger {
  const env = process.env.NODE_ENV ?? 'production';

  if (env === 'production') {
    const nulllog: any = () => undefined; // eslint-disable-line
    return nulllog;
  }

  return debug(`${channel}:${path.basename(filename, '.ts')}`);
}
