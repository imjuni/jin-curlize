// import { readFileSync } from 'fs';
// import { argv, logger, option, task } from 'just-scripts';
import { logger, option, task, series } from 'just-scripts';
import { exec } from 'just-scripts-utils';

option('env', { default: { env: 'develop' } });

task('clean', async () => {
  await exec('rimraf dist artifact', {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('ctix-create', async () => {
  const cmd = 'NODE_ENV=production ctix --project ./tsconfig.json';
  logger.info('ctix: ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('ctix-clean', async () => {
  const cmd = 'NODE_ENV=production ctix clean --project ./tsconfig.json';
  logger.info('ctix: ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('build-only', async () => {
  const cmd = 'NODE_ENV=production webpack --config webpack.config.prod.js';
  logger.info('Build: ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('publish-develop', async () => {
  const cmd = 'npm publish --registry http://localhost:8901 --force';

  logger.info('Publish package to verdaccio: ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('publish-production', async () => {
  const cmd = 'npm publish --registry https://registry.npmjs.org';

  logger.info('Publish package to npm registry: ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('clean', async () => {
  const cmd = 'rimraf dist';

  logger.info('Clean builded directory: ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('ctix', series('ctix-clean', 'ctix-create'));
task('build', series('clean', 'ctix', 'build-only'));
task('pub', series('build', 'publish-develop', 'ctix-clean'));
task('pub:prod', series('build', 'publish-production'));
