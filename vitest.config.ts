import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    root: '.',
    include: ['**/src/**/*.test.ts'],
    typecheck: {
      checker: 'tsc',
      tsconfig: './tsconfig.json',
    },
    coverage: {
      enabled: true,
      // @vitest/coverage-istanbul
      // provider: 'istanbul', // or 'v8'
      provider: 'v8', // or 'v8'
      exclude: [
        'src/interfaces/IAxiosRequestConfigOptions.ts',
        'src/interfaces/ICurlizeOptions.ts',
        'src/interfaces/IFastifyMultipartFormData.ts',
        'src/interfaces/JSONValue.ts',
      ],
      include: ['**/src/**'],
    },
  },
});
