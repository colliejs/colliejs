import { Config, createTheme, defaultConfig, toHash } from "@colliejs/core";
import { Alias, transform } from "@colliejs/transform";
import { FilterPattern, createFilter } from "@rollup/pluginutils";
import log from "npmlog";

import { writeFile } from "@colliejs/shared";
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
const __dirname = path.dirname(new URL(import.meta.url).pathname);

type VitePluginOptions = {
  include?: FilterPattern;
  exclude?: FilterPattern;
  styledConfig?: Config;
  alias?: Alias;
  root?: string;
  entry: string;
};
type LayerName = string;

const UNCHANGED = null;

const writeStyledThemeCssTexts = (
  styledConfig: Config,
  cssFileName: string
) => {
  const cssText = createTheme(styledConfig);
  writeFile(cssFileName, cssText);
};

const collie = (option: VitePluginOptions): Plugin => {
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
      // collie.config.js配置文件变动后，重新生成theme 样式文件
      //===========================================================
      const isEntry = path.resolve(root, entry) === url;
      if (isEntry) {
        const cssFile = path.resolve(__dirname, "theme.css");
        writeStyledThemeCssTexts(styledConfig, cssFile);
        return {
          code: `import "${cssFile}"; ${code}`,
          map: { mappings: "" },
        };
      }

      //===========================================================
      // 普通文件
      //===========================================================
      let {
        code: transformedCode,
        styledElementCssTexts,
        styledComponentCssTexts,
      } = transform(code, url, styledConfig, alias, root);
      const prefix = path.resolve(__dirname, "collie-cache");
      const cssFile = `${prefix}/${path.basename(url)}-${toHash(url)}.css`;
      const content = styledElementCssTexts + "\n" + styledComponentCssTexts;
      writeFile(cssFile, content);

      return {
        code: `import "${cssFile}"; ${transformedCode}`,
        map: { mappings: "" },
      };
    },
  };
};
export default collie;
