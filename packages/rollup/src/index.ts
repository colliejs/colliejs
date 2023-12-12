import { BaseConfig, createTheme, defaultConfig } from "@colliejs/core";
import { Alias, transform } from "@colliejs/transform";
import { FilterPattern, createFilter } from "@rollup/pluginutils";
import fs from "node:fs";
import path from "node:path";
import { type Plugin } from "rollup";
import { writeFile } from "@colliejs/shared";

type Option<Config extends BaseConfig> = {
  outDir: string;
  include?: FilterPattern;
  exclude?: FilterPattern;
  styledConfig?: Config;
  alias?: Alias;
  root?: string;
};
const writeThemeText = (styledConfig, cssFilename) => {
  const cssText = createTheme(styledConfig);
  writeFile(cssFilename, cssText);
};

const collie = <Config extends BaseConfig>(option?: Option<Config>): Plugin => {
  const {
    outDir = "dist/",
    include,
    exclude,
    styledConfig = defaultConfig,
    alias = {},
    root = process.cwd(),
  } = option || {};
  const allStyledElementCssMap = {};
  const allStyledComponentCssMap = {};
  const filter = createFilter(include, exclude);
  return {
    name: "collie",
    async transform(code, id) {
      const REGEX_JS = /\.[tj]sx?$/;

      if (!REGEX_JS.test(id) || !filter(id) || id.includes("node_modules")) {
        return { code: code };
      }

      let {
        code: codeTransformed,
        styledElementCssTexts,
        styledComponentCssTexts,
      } = transform(code, id, styledConfig, alias, root);

      allStyledElementCssMap[id] = styledElementCssTexts;
      allStyledComponentCssMap[id] = styledComponentCssTexts;

      return {
        code: codeTransformed,
        map: { mappings: "" }, // a sourcemap is optional
      };
    },

    generateBundle(options, bundle) {
      writeThemeText(styledConfig, path.resolve(outDir, "theme.css"));
      const cssFilename = path.resolve(outDir, "index.css");

      writeFile(
        cssFilename,
        Object.values(allStyledComponentCssMap).join("\n")
      );
      fs.writeFileSync(
        cssFilename,
        Object.values(allStyledElementCssMap).join("\n"),
        {
          encoding: "utf-8",
          flag: "a",
        }
      );
    },
  };
};
export default collie;
