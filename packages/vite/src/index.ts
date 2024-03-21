import { CollieConfig } from "@colliejs/config";
import { defaultConfig } from "@colliejs/config";
import { Alias, transform } from "@colliejs/transform";
import { FilterPattern, createFilter } from "@rollup/pluginutils";
import log from "npmlog";

import { shouldSkip } from "@colliejs/shared";
import { createRequire } from "node:module";
import path from "path";
import type { Plugin, ResolvedConfig } from "vite";

global.require = global.require || createRequire(import.meta.url);



const UNCHANGED = null;

const collie = (option: CollieConfig): Plugin => {
  const {
    build: { include, exclude, entry, alias: _alias },
    css:cssConfig,
  } = option;
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
      let { code } = transform(source, url, cssConfig, alias, root);
      return {
        code,
        map: { mappings: "" },
      };
    },
  };
};
export default collie;
