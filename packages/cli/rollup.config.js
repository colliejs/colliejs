import rollupConfig from "../../scripts/rollup.config.js";

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  ...rollupConfig,

  external: [...rollupConfig.external, "chokidar"],
};
export default config;
