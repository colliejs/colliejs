import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import strip from "@rollup/plugin-strip";
import path from "path";
import { fileURLToPath } from "url";

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
  ],
  external: [
    "react",
    "react-dom",
    "lodash",
    "react/jsx-runtime",
    "react-dom/client",
    "picomatch",
    "lodash",
    /tsx\//,
    "npmlog",
    "chokidar",
    "fast-glob",
    "rollup",
    "@rollup/pluginutils",
    "resolve",
    "numeral",
    "npmlog",
    "dayjs",
    /@colliejs\//,
    /@babel\//,
    /@rollup\//,
    /node:/,
  ],
};

export default config;
