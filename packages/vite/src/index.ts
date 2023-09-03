import { Config, defaultConfig, createTheme } from "@colliejs/core";
import {
  getDepPaths,
  getImports,
  parseCode,
  getLayerTextFromPath,
  getCssText,
  transform,
} from "@colliejs/transform";
import { FilterPattern, createFilter } from "@rollup/pluginutils";
import log from "npmlog";

import fs from "node:fs";
import { createRequire } from "node:module";
import path from "path";
import { Plugin } from "vite";

global.require = global.require || createRequire(import.meta.url);

global.window = {
  //@ts-ignore
  CSS: {
    supports: () => {
      return true;
    },
  },
};

type VitePluginOptions = {
  include?: FilterPattern;
  exclude?: FilterPattern;
  index?: string;
  styledElementCssFile?: string;
  styledComponentCssFile?: string;
  styledConfig?: Config;
};
type LayerName = string;

const UNCHANGED = null;

const writeCssText = (cssText: string, cssFilename: string) => {
  fs.mkdirSync(path.dirname(cssFilename), { recursive: true });
  fs.writeFileSync(cssFilename, cssText, {
    encoding: "utf-8",
    flag: "w",
  });
};

const writeStyledElementCssTexts = (
  styledElementCssMap: object,
  cssFilename: string
) => {
  const cssText = Object.values(styledElementCssMap).join("\n");
  writeCssText(cssText, cssFilename);
};

const writeStyledComponentCssTexts = (
  allCssLayerDeps: Record<LayerName, LayerName>,
  allStyledComponentCssMap: Record<LayerName, string>,
  cssFilename: string
) => {
  const cssText = getCssText(allCssLayerDeps, allStyledComponentCssMap);
  writeCssText(cssText, cssFilename);
};

const collie = (option: VitePluginOptions): Plugin => {
  const {
    include,
    exclude,
    styledElementCssFile = "styled-element.css",
    styledComponentCssFile = "styled-component.css",
    index = "src/index.ts",
    styledConfig = defaultConfig,
  } = option || {};
  const filter = createFilter(include, exclude);
  const allCssLayerDeps = {};
  const allStyledElementCssMap = {};
  const allStyledComponentCssMap = {};

  return {
    name: "collie",
    enforce: "pre",
    async transform(_code, url) {
      if (
        url.includes("node_modules") ||
        !filter(url) ||
        !/\.[cm]?[tj]sx?$/.test(url)
      ) {
        return UNCHANGED;
      }
      log.verbose("transform", "changed url is: ", url);
      //===========================================================
      // collie.config.js配置文件变动后，重新生成theme 样式文件
      //===========================================================
      if (/collie\.config\.(ts|js|cjs)/.test(url)) {
        const cssText = createTheme(styledConfig);
        const cssFilename = "collie.config.css";
        writeCssText(cssText, cssFilename);

        return UNCHANGED;
      }

      //===========================================================
      // 普通文件
      //===========================================================
      const imports = getImports(parseCode(_code).program, path.dirname(url));
      let { code, styledComponentCssMap, styledElementCssTexts, cssLayerDep } =
        transform(_code, url, imports, styledConfig);

      allStyledElementCssMap[url] = styledElementCssTexts;
      writeStyledElementCssTexts(allStyledElementCssMap, styledElementCssFile);
      if (Object.keys(styledComponentCssMap).length) {
        Object.assign(allCssLayerDeps, cssLayerDep);
        Object.assign(allStyledComponentCssMap, styledComponentCssMap);
        writeStyledComponentCssTexts(
          allCssLayerDeps,
          allStyledComponentCssMap,
          styledComponentCssFile
        );
      }
      return {
        code: code,
        map: { mappings: "" }, // a sourcemap is optional
      };
    },
  };
};
export default collie;
