// sources
// * https://github.com/enketo/enketo-express/blob/master/tools/esbuild-plugin-istanbul.js

const { readFileSync } = require('fs');
const { createInstrumenter } = require('istanbul-lib-instrument');

/**
 * @typedef {import('istanbul-lib-instrument').InstrumenterOptions} InstrumenterOptions
 */

/**
 * @typedef {import('source-map').RawSourceMap} RawSourceMap
 */

const instrumenter = createInstrumenter({
  compact: false,
  esModules: true,
});

/**
 * @param {string} source
 * @param {string} path
 * @param {RawSourceMap} [inputSourceMap]
 * @return {Promise<string>}
 */
const instrument = (source, path, inputSourceMap) =>
  new Promise((resolve, reject) => {
    instrumenter.instrument(
      source,
      path,
      (error, code) => {
        if (error == null) {
          resolve(code);
        } else {
          reject(error);
        }
      },
      inputSourceMap
    );
  });

/**
 * @return {import('esbuild').Plugin}
 */
const esbuildPluginIstanbul = () => ({
  name: 'istanbul',
  setup(build) {
    build.onLoad({ filter: /\\svg-path-commander\\src\\/ },
      async ({ path }) => {
        const contents = String(readFileSync(path));

        const instrumented = await instrument(contents, path);

        return { contents: instrumented };
      }
    );
  },
});

module.exports = esbuildPluginIstanbul;