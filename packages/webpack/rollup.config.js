import rollupConfig from "../../scripts/rollup.config.js";
/**
 * @type {import('rollup').RollupOptions}
 */
const loaderConfig = {
  ...rollupConfig,
  input: "src/loader.ts",
  output: [
    {
      file: "dist/loader.mjs",
      format: "es",
    },
    {
      file: "dist/loader.cjs",
      format: "cjs",
    },
  ],
  external: [
    ...rollupConfig["external"],
    "loader-utils",
    "webpack",
    "schema-utils",
    "fast-safe-stringify",
  ],
};
export default loaderConfig;
