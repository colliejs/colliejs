import rollupConfig from '../../scripts/rollup.config.js';

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  ...rollupConfig,

  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    'react-dom/client',
    'lodash',
    /@collie/,
  ],
};
export default config;
