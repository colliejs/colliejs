import { parse } from "@babel/parser";
import { Config, createTheme, defaultConfig } from "@colliejs/core";
import {
  Alias,
  getCssText,
  getDepPaths,
  getImports,
  transform,
} from "@colliejs/transform";
import { FilterPattern, createFilter } from "@rollup/pluginutils";
import fs from "node:fs";
import path from "node:path";
import { type Plugin } from "rollup";

type Option = {
  outDir: string;
  include?: FilterPattern;
  exclude?: FilterPattern;
  styledConfig?: Config;
  alias?: Alias;
  root?: string;
};
const allStyledComponentCssMap = {};
type LayerName = string;
const writeThemeText = (styledConfig, cssFilename) => {
  const cssText = createTheme(styledConfig);
  if (!fs.existsSync(cssFilename)) {
    fs.mkdirSync(path.dirname(cssFilename), { recursive: true });
  }
  fs.writeFileSync(cssFilename, cssText, {
    encoding: "utf-8",
    flag: "w",
  });
};

const collie = (option?: Option): Plugin => {
  const {
    outDir = "dist/",
    include,
    exclude,
    styledConfig = defaultConfig,
    alias = {},
    root = process.cwd(),
  } = option || {};
  const allStyledElementCssMap = {};
  const allCssLayerDeps = {};
  const allStyledComponentCssMap = {};

  const filter = createFilter(include, exclude);

  return {
    name: "collie", // this name will show up in warnings and errors

    async transform(code, id) {
      const REGEX_JS = /\.[tj]sx?$/;

      if (!REGEX_JS.test(id) || !filter(id) || id.includes("node_modules")) {
        return { code: code };
      }

      let {
        code: codeTransformed,
        styledElementCssTexts,
        styledComponentCssMap,
        cssLayerDep,
      } = transform(code, id, styledConfig, alias, root);
      //===========================================================
      // 处理styledElementCssTexts
      //===========================================================
      allStyledElementCssMap[id] = styledElementCssTexts;

      //===========================================================
      // 处理allStyledComponentCssMap
      //===========================================================
      Object.assign(allCssLayerDeps, cssLayerDep);
      Object.assign(allStyledComponentCssMap, styledComponentCssMap);
      return {
        code: codeTransformed,
        map: { mappings: "" }, // a sourcemap is optional
      };
    },

    generateBundle(options, bundle) {
      const themeFileName = path.resolve(outDir, "theme.css");
      writeThemeText(styledConfig, themeFileName);

      const cssFilename = path.resolve(outDir, "index.css");
      const cssText = getCssText(allCssLayerDeps, allStyledComponentCssMap);

      //ignore empty layer
      if (cssText.replace(/[\n\s]/g, "") === "") return;

      if (!fs.existsSync(cssFilename)) {
        fs.mkdirSync(path.dirname(cssFilename), { recursive: true });
      }

      fs.writeFileSync(cssFilename, cssText, {
        encoding: "utf-8",
        flag: "w",
      });
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
