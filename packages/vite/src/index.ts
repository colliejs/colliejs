import { BaseConfig, createTheme } from "@colliejs/core";
import { defaultConfig } from "@colliejs/shared";
import { Alias, transform } from "@colliejs/transform";
import { FilterPattern, createFilter } from "@rollup/pluginutils";
import log from "npmlog";

import { writeFile, getCssFileName, writeThemeCssFile } from "@colliejs/shared";
import { createRequire } from "node:module";
import path from "path";
import type { Plugin, ResolvedConfig } from "vite";

global.require = global.require || createRequire(import.meta.url);

type VitePluginOptions<Config extends BaseConfig> = {
  include?: FilterPattern;
  exclude?: FilterPattern;
  styledConfig?: Config;
  alias?: Alias;
  root?: string;
  entry: string;
};

const UNCHANGED = null;

const collie = <Config extends BaseConfig>(
  option: VitePluginOptions<Config>
): Plugin => {
  const {
    include,
    exclude,
    styledConfig = defaultConfig,
    alias = {},
    root = process.cwd(),
    entry,
  } = option || {};
  const filter = createFilter(include, exclude);
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
      // entry变动后，重新生成theme 样式文件
      //===========================================================
      const isEntryFile = path.resolve(root, entry) === url;
      let themeCssFile = "";
      if (isEntryFile) {
        themeCssFile = writeThemeCssFile(
          styledConfig.theme,
          styledConfig.prefix,
          root
        );
      }
      const importThemeCssText = themeCssFile
        ? `import "${themeCssFile}";`
        : "";

      //===========================================================
      // 普通文件
      //===========================================================
      let {
        code: transformedCode,
        styledElementCssTexts,
        styledComponentCssTexts,
      } = transform(code, url, styledConfig, alias, root);
      const cssFile = getCssFileName(url)(root);
      const cssTexts = `${styledElementCssTexts}\n${styledComponentCssTexts}`;
      const hasCssText = cssTexts.replace(/\s/g, "").length > 0;
      if (!hasCssText && !isEntryFile) {
        return UNCHANGED;
      }
      writeFile(cssFile, cssTexts);

      return {
        code: `import "${cssFile}";\n ${importThemeCssText}; ${transformedCode}`,
        map: { mappings: "" },
      };
    },
  };
};
export default collie;
