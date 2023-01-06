import { promises } from 'node:fs';
import { g as getWorkerState, a as resetModules } from './chunk-typecheck-constants.06e1fe5b.js';
import { v as vi } from './chunk-utils-import.e7f64637.js';
import { a as envs } from './chunk-env-node.b3664da2.js';
import { a as setupGlobalEnv, s as startTests, w as withEnv } from './chunk-runtime-setup.a06d5c72.js';
import 'node:path';
import './chunk-utils-env.3fdc1793.js';
import 'tty';
import 'node:url';
import 'path';
import 'local-pkg';
import './chunk-runtime-chain.f51aa930.js';
import 'util';
import 'chai';
import './vendor-_commonjsHelpers.addc3445.js';
import './chunk-runtime-rpc.54d72169.js';
import './chunk-utils-timers.715da787.js';
import './chunk-utils-source-map.5278ee22.js';
import 'fs';
import './spy.js';
import 'tinyspy';
import 'node:console';
import 'perf_hooks';
import './chunk-integrations-coverage.befed097.js';
import './chunk-runtime-error.f5c8aaf2.js';
import 'vite-node/source-map';

function groupBy(collection, iteratee) {
  return collection.reduce((acc, item) => {
    const key = iteratee(item);
    acc[key] || (acc[key] = []);
    acc[key].push(item);
    return acc;
  }, {});
}
async function run(files, config) {
  await setupGlobalEnv(config);
  const workerState = getWorkerState();
  if (config.browser) {
    workerState.mockMap.clear();
    await startTests(files, config);
    return;
  }
  const filesWithEnv = await Promise.all(files.map(async (file) => {
    var _a, _b;
    const code = await promises.readFile(file, "utf-8");
    const env = ((_a = code.match(/@(?:vitest|jest)-environment\s+?([\w-]+)\b/)) == null ? void 0 : _a[1]) || config.environment || "node";
    const envOptions = JSON.parse(((_b = code.match(/@(?:vitest|jest)-environment-options\s+?(.+)/)) == null ? void 0 : _b[1]) || "null");
    return {
      file,
      env,
      envOptions: envOptions ? { [env]: envOptions } : null
    };
  }));
  const filesByEnv = groupBy(filesWithEnv, ({ env }) => env);
  const orderedEnvs = envs.concat(
    Object.keys(filesByEnv).filter((env) => !envs.includes(env))
  );
  for (const env of orderedEnvs) {
    const environment = env;
    const files2 = filesByEnv[environment];
    if (!files2 || !files2.length)
      continue;
    globalThis.__vitest_environment__ = environment;
    const filesByOptions = groupBy(files2, ({ envOptions }) => JSON.stringify(envOptions));
    for (const options of Object.keys(filesByOptions)) {
      const files3 = filesByOptions[options];
      if (!files3 || !files3.length)
        continue;
      await withEnv(environment, files3[0].envOptions || config.environmentOptions || {}, async () => {
        for (const { file } of files3) {
          if (config.isolate) {
            workerState.mockMap.clear();
            resetModules(workerState.moduleCache, true);
          }
          workerState.filepath = file;
          await startTests([file], config);
          workerState.filepath = void 0;
          vi.resetConfig();
        }
      });
    }
  }
}

export { run };
