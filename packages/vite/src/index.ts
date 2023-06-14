import log from "npmlog";
import { Config, defaultConfig } from "@colliejs/core";
import { parse } from "@babel/parser";
import { createFilter, FilterPattern } from "@rollup/pluginutils";
import { getDepPaths, transform, parseCode, getImports } from "@colliejs/transform";

import fs from "node:fs";
import { createRequire } from "node:module";
import path from "path";
import { Plugin, ResolvedConfig } from "vite";

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
  index: string;
  styled: Config;
  // sourceMap?: boolean;
  // preprocessor?: Preprocessor;
};

const getLayerText = (cssLayerDeps: Record<string, string>) => {
  const depPaths = getDepPaths(cssLayerDeps);
  const layerText = depPaths
    .map(path => {
      const text = path.reduce((acc: string, cur) => {
        return (acc = `${cur.name},${acc}`);
      }, "");
      return `@layer ${text.slice(0, -1)};\n`;
    })
    .join("\n");
  return layerText;
};

const UNCHANGED = null;

const genCssFileName = (url: string) => {
  return `${path.dirname(url)}/.cache/${path.basename(
    url,
    path.extname(url)
  )}.css`;
};

const writeCssText = (cssText: string, cssFilename: string) => {
  fs.mkdirSync(path.dirname(cssFilename), { recursive: true });
  fs.writeFileSync(cssFilename, cssText, {
    encoding: "utf-8",
    flag: "w",
  });
  return cssFilename;
};

const collie = (option: VitePluginOptions): Plugin => {
  const {
    include,
    exclude,
    index = "src/index.ts",
    styled = defaultConfig,
  } = option || {};
  const cssLayerDeps = {};
  const filter = createFilter(include, exclude);

  return {
    name: "collie",
    async transform(_code, url) {
      const REGEX_JS = /\.[cm]?[tj]sx?$/;
      if (url.includes("node_modules") || !filter(url) || !REGEX_JS.test(url)) {
        return UNCHANGED;
      }
      log.info("transform", "changed url is: ", url);
      const imports = getImports(parseCode(_code).program, path.dirname(url));
      let { code, cssText, cssLayerDep } = transform(
        _code,
        url,
        imports,
        styled
      );
      //如果有cssLayerDep，就把它合并到cssLayerDeps
      Object.assign(cssLayerDeps, cssLayerDep);

      let codeWithCss;
      if (cssText) {
        const cssFilename = genCssFileName(url);
        const layerText = getLayerText(cssLayerDeps);
        //TODO:这里会重复写入。但是没更好的方法保证cssLayer在普通cssText之前了
        writeCssText(`${layerText}\n${cssText}`, cssFilename);
        codeWithCss = `import "${cssFilename}"\n${code}`;
      }

      return {
        code: codeWithCss,
        map: { mappings: "" }, // a sourcemap is optional
      };
    },
  };
};
export default collie;
