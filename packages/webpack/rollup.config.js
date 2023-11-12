import rollupConfig from "../../scripts/rollup.config.js";
/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  ...rollupConfig,
  input: ["src/loader.ts", "src/plugin.ts"],
  output: {
    dir: "dist",
  },
  external: [
    ...rollupConfig["external"],
    "loader-utils",
    "webpack",
    "schema-utils",
    "fast-safe-stringify",
  ],
};
export default config;
