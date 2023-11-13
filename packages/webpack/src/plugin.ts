import { Compilation, Compiler } from "webpack";
import fs from "node:fs";
import path from "node:path";
const safeStringify = require("fast-safe-stringify");
import { LayerName, getCssText, transform } from "@colliejs/transform";
import { Config, defaultConfig, createTheme } from "@colliejs/core";

const PLUGIN_NAME = "CollieWebpackPlugin";
const allStyledElementCssMap: any = {};
const allStyledComponentCssMap: any = {};
const allCssLayerDeps: any = {};

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

export default class CollieWebpackPlugin {
  private outputDir: string = process.cwd();

  apply(compiler: Compiler) {
    const { webpack } = compiler;
    const { RawSource } = webpack.sources;
    compiler.hooks.make.tap(PLUGIN_NAME, compilation => {
      this.outputDir = compilation.options.output.path || process.cwd();
    });

    compiler.hooks.emit.tap(PLUGIN_NAME, (compilation: Compilation) => {
      writeStyledElementCssTexts(
        allStyledElementCssMap,
        path.resolve(this.outputDir, "./styled-element.css")
      );
      writeStyledComponentCssTexts(
        allCssLayerDeps,
        allStyledComponentCssMap,
        path.resolve(this.outputDir, "./styled-component.css"),
        defaultConfig
      );
    });

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: Compilation) => {
      compilation.hooks.buildModule.tap(PLUGIN_NAME, module => {
        //@ts-ignore
        const url = module.resource || "";
        if (/\.[tj]sx?$/.test(url) && !/node_modules/.test(url)) {
          console.log("===>url", url);
          const code = fs.readFileSync(url, "utf-8");
          let { styledElementCssTexts, cssLayerDep, styledComponentCssMap } =
            transform(code, url, defaultConfig);
          allStyledElementCssMap[url] = styledElementCssTexts;
          Object.assign(allCssLayerDeps, cssLayerDep);
          Object.assign(allStyledComponentCssMap, styledComponentCssMap);
        }
      });
    });
  }
}
