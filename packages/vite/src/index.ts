import { Config, defaultConfig, createTheme, toHash } from "@colliejs/core";
import {
  getDepPaths,
  getImports,
  parseCode,
  getLayerTextFromPath,
  getCssText,
  transform,
  Alias,
} from "@colliejs/transform";
import { FilterPattern, createFilter } from "@rollup/pluginutils";
import log from "npmlog";

import fs from "node:fs";
import { createRequire } from "node:module";
import path from "path";
import { HtmlTagDescriptor, Plugin, ResolvedConfig, UserConfig } from "vite";
import { config } from "node:process";
import type { OutputBundle } from "rollup";

global.require = global.require || createRequire(import.meta.url);

global.window = {
  //@ts-ignore
  CSS: {
    supports: () => {
      return true;
    },
  },
};
const styledElementCssFile = "styled-element.css";
const styledComponentCssFile = "styled-component.css";
const styledThemeCssFile = "style.theme.css";
const serve = {
  href: {
    styledElementCssFile: `/src/${styledElementCssFile}`,
    styledComponentCssFile: `/src/${styledComponentCssFile}`,
    styledThemeCssFile: `/src/${styledThemeCssFile}`,
  },
  disk: {
    styledElementCssFile: `src/${styledElementCssFile}`,
    styledComponentCssFile: `src/${styledComponentCssFile}`,
    styledThemeCssFile: `src/${styledThemeCssFile}`,
  },
};
const build = {
  href: {
    styledElementCssFile: `/${styledElementCssFile}`,
    styledComponentCssFile: `/${styledComponentCssFile}`,
    styledThemeCssFile: `/${styledThemeCssFile}`,
  },
  disk: {
    styledElementCssFile: `dist/${styledElementCssFile}`,
    styledComponentCssFile: `dist/${styledComponentCssFile}`,
    styledThemeCssFile: `dist/${styledThemeCssFile}`,
  },
};

type VitePluginOptions = {
  include?: FilterPattern;
  exclude?: FilterPattern;
  styledConfig?: Config;
  alias?: Alias;
  root?: string;
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
  cssFilename: string,
  styledConfig: Config
) => {
  const cssText = getCssText(allCssLayerDeps, allStyledComponentCssMap);
  const finalCssText = `@layer ${styledConfig.layername} {
    ${cssText}
  }`;
  writeCssText(finalCssText, cssFilename);
};
const writeStyledThemeCssTexts = (
  styledConfig: Config,
  cssFileName: string
) => {
  const cssText = createTheme(styledConfig);
  writeCssText(cssText, cssFileName);
};

const collie = (option: VitePluginOptions): Plugin => {
  const {
    include,
    exclude,
    styledConfig = defaultConfig,
    alias = {},
    root = process.cwd(),
  } = option || {};
  const filter = createFilter(include, exclude);
  const allCssLayerDeps = {};
  const allStyledElementCssMap = {};
  const allStyledComponentCssMap = {};
  const fileHashMap = {};
  let viteConfig: ResolvedConfig;

  return {
    name: "collie",
    enforce: "pre",
    configResolved(resolvedConfig) {
      viteConfig = resolvedConfig;
    },
    async transform(code, url) {
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
        writeStyledThemeCssTexts(styledConfig, serve.disk.styledThemeCssFile);
        return UNCHANGED;
      }

      //===========================================================
      // 普通文件
      //===========================================================

      let {
        code: transformedCode,
        styledComponentCssMap,
        styledElementCssTexts,
        cssLayerDep,
      } = transform(code, url, styledConfig, alias, root);

      allStyledElementCssMap[url] = styledElementCssTexts;
      const isServe = viteConfig.command === "serve";
      isServe &&
        writeStyledElementCssTexts(
          allStyledElementCssMap,
          serve.disk.styledElementCssFile
        );
      if (Object.keys(styledComponentCssMap).length) {
        Object.assign(allCssLayerDeps, cssLayerDep);
        Object.assign(allStyledComponentCssMap, styledComponentCssMap);
        isServe &&
          writeStyledComponentCssTexts(
            allCssLayerDeps,
            allStyledComponentCssMap,
            serve.disk.styledComponentCssFile,
            styledConfig
          );
      }
      return {
        code: transformedCode,
        map: { mappings: "" },
      };
    },
    async generateBundle(...args) {
      console.log("option,bundle", args);
      writeStyledElementCssTexts(
        allStyledElementCssMap,
        build.disk.styledElementCssFile
      );
      writeStyledComponentCssTexts(
        allCssLayerDeps,
        allStyledComponentCssMap,
        build.disk.styledComponentCssFile,
        styledConfig
      );
      writeStyledThemeCssTexts(styledConfig, build.disk.styledThemeCssFile);
      fileHashMap[styledElementCssFile] = toHash(allStyledElementCssMap);
      fileHashMap[styledComponentCssFile] = toHash(allStyledComponentCssMap);
      fileHashMap[styledThemeCssFile] = toHash(JSON.stringify(styledConfig));
    },
    async transformIndexHtml(html) {
      const getLinkTag = (href: string): HtmlTagDescriptor => ({
        tag: "link",
        attrs: {
          rel: "stylesheet",
          href: href,
        },
        injectTo: "body-prepend",
      });

      console.log("transformIndexHtml");
      if (viteConfig.command === "serve") {
        return {
          html,
          tags: [
            getLinkTag(serve.href.styledElementCssFile),
            getLinkTag(serve.href.styledComponentCssFile),
            getLinkTag(serve.href.styledThemeCssFile),
          ],
        };
      } else {
        return {
          html,
          tags: [
            getLinkTag(
              `${build.href.styledElementCssFile}?hash=${fileHashMap[styledElementCssFile]}`
            ),
            getLinkTag(
              `${build.href.styledComponentCssFile}?hash=${fileHashMap[styledComponentCssFile]}`
            ),
            getLinkTag(
              `${build.href.styledThemeCssFile}?hash=${fileHashMap[styledThemeCssFile]}`
            ),
          ],
        };
      }
    },
  };
};
export default collie;
