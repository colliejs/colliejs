import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import strip from "@rollup/plugin-strip";
import path from "path";
import { fileURLToPath } from "url";
import terser  from "@rollup/plugin-terser";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const extensions = [".js", ".jsx", ".ts", ".tsx"];
const babelConfigFile = path.join(__dirname, "../babel.config.cjs");

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.mjs",
      format: "es",
    },
    {
      file: "dist/index.cjs",
      format: "cjs",
    },
  ],
  plugins: [
    replace({
      preventAssignment: true,
      __DEV__: process.env.NODE_ENV === "development",
    }),
    resolve({
      jsnext: true,
      extensions: extensions,
    }),
    commonjs(),
    json(),
    babel({ babelHelpers: "bundled", extensions, configFile: babelConfigFile }),
    // strip({ include: /src\/.*\.[mc]?[jt]sx?$/ }),
    terser(),
  ],
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "react-dom/client",
    "rollup",
    "@rollup/pluginutils",
    /@rollup\//,
    /node:/,
  ],
};

export default config;
