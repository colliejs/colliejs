import rollupConfig from "../../scripts/rollup.config.js";
/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  ...rollupConfig,
  external: [
    ...rollupConfig["external"],
    "loader-utils",
    "webpack",
    "schema-utils",
    "fast-safe-stringify",
  ],
};
export default config;
