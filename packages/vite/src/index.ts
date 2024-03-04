import { BaseConfig, createTheme } from "@colliejs/core";
import { defaultConfig } from "@colliejs/config";
import { Alias, transform } from "@colliejs/transform";
import { FilterPattern, createFilter } from "@rollup/pluginutils";
import log from "npmlog";

import { shouldSkip } from "@colliejs/shared";
import { createRequire } from "node:module";
import path from "path";
import type { Plugin, ResolvedConfig } from "vite";

global.require = global.require || createRequire(import.meta.url);

type VitePluginOptions<Config extends BaseConfig> = {
  include?: FilterPattern;
  exclude?: FilterPattern;
  styledConfig?: Config;
  entry: string;
  alias?: Alias;
};

const UNCHANGED = null;

const collie = <Config extends BaseConfig>(
  option: VitePluginOptions<Config>
): Plugin => {
  const {
    include,
    exclude,
    styledConfig = defaultConfig,
    entry,
    alias: _alias,
  } = option || {};
  const filter = createFilter(include, exclude);
  let viteConfig: ResolvedConfig;

  return {
    name: "collie",
    enforce: "pre",
    configResolved(resolvedConfig) {
      viteConfig = resolvedConfig;
    },
    async transform(source, url) {
      if (shouldSkip(url, filter)) {
        return UNCHANGED;
      }

      log.verbose("transform", "changed url is: ", url);
      const root = viteConfig.root || process.cwd();
      const alias = _alias || viteConfig.resolve.alias || {};

      //===========================================================
      // 普通文件
      //===========================================================
      let { code } = transform(source, url, styledConfig, alias, root);
      return {
        code,
        map: { mappings: "" },
      };
    },
  };
};
export default collie;
