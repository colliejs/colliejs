import { defaultConfig } from "@border-collie-js/core";
import { parse } from "@babel/parser";
import { getDepPaths, getImports, transform } from "@border-collie-js/transform";
import fs from "node:fs";
import path from "node:path";
import { type Plugin } from "rollup";
import { createFilter, FilterPattern } from "@rollup/pluginutils";

type Option = {
  outDir: string;
  include?: FilterPattern;
  exclude?: FilterPattern;
};
const collie = (option?: Option): Plugin => {
  const { outDir = "dist/", include, exclude } = option || {};
  let cssTexts = "";
  const cssLayerDeps = {};
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
      let { code, cssText, cssLayerDep } = transform(
        _code,
        id,
        imports,
        defaultConfig // //TODO: 从配置文件中读取config:Config
      );
      cssTexts += cssText + "\n";
      Object.assign(cssLayerDeps, cssLayerDep);
      return {
        code: code,
        map: { mappings: "" }, // a sourcemap is optional
      };
    },

    generateBundle(options, bundle) {
      const cssFilename = path.resolve(outDir, "index.css");

      const depPaths = getDepPaths(cssLayerDeps);
      const layerText = depPaths
        .map(path => {
          const text = path.reduce((acc, cur) => {
            return (acc = `${cur.name},${acc}`);
          }, "");
          return `@layer ${text.slice(0, -1)};\n`;
        })
        .join("\n");

      //ignore empty layer
      if (layerText.replace(/[\n\s]/g, "") === "") return;

      if (!fs.existsSync(cssFilename)) {
        fs.mkdirSync(path.dirname(cssFilename), { recursive: true });
      }

      fs.writeFileSync(cssFilename, layerText, {
        encoding: "utf-8",
        flag: "w",
      });
      fs.writeFileSync(cssFilename, cssTexts, {
        encoding: "utf-8",
        flag: "a",
      });
    },
  };
};
export default collie;
