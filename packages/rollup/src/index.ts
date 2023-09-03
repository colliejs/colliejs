import { parse } from "@babel/parser";
import { Config, createTheme, defaultConfig } from "@colliejs/core";
import {
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

// const writeCssText = (cssText: string, cssFilename: string) => {
//   fs.mkdirSync(path.dirname(cssFilename), { recursive: true });
//   fs.writeFileSync(cssFilename, cssText, {
//     encoding: "utf-8",
//     flag: "w",
//   });
// };

// const writeStyledElementCssTexts = (
//   styledElementCssMap: object,
//   cssFilename: string
// ) => {
//   const cssText = Object.values(styledElementCssMap).join("\n");
//   writeCssText(cssText, cssFilename);
// };

// const writeStyledComponentCssTexts = (
//   allCssLayerDeps: Record<LayerName, LayerName>,
//   allStyledComponentCssMap: Record<LayerName, string>,
//   cssFilename: string
// ) => {
//   const cssText = getCssText(allCssLayerDeps, allStyledComponentCssMap);
//   writeCssText(cssText, cssFilename);
// };

const collie = (option?: Option): Plugin => {
  const {
    outDir = "dist/",
    include,
    exclude,
    styledConfig = defaultConfig,
  } = option || {};
  const allStyledElementCssMap = {};
  const allCssLayerDeps = {};
  const allStyledComponentCssMap = {};

  const filter = createFilter(include, exclude);

  return {
    name: "collie", // this name will show up in warnings and errors

    async transform(_code, id) {
      const REGEX_JS = /\.[tj]sx?$/;

      if (!REGEX_JS.test(id) || !filter(id) || id.includes("node_modules")) {
        return { code: _code };
      }

      const program = parse(_code, {
        sourceType: "module",
        plugins: ["jsx", "typescript"],
      }).program;

      const imports = getImports(program, path.dirname(id));
      let { code, styledElementCssTexts, styledComponentCssMap, cssLayerDep } =
        transform(_code, id, imports, styledConfig);
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
        code: code,
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
