import { BaseConfig } from "@colliejs/core";
import { CollieConfig } from "@colliejs/config";
import { Alias, transform } from "@colliejs/transform";
import { defaultConfig } from "@colliejs/config";
import { LoaderContext } from "webpack";
import { FilterPattern, createFilter } from "@rollup/pluginutils";
import path from "node:path";
import { shouldSkip } from "@colliejs/shared";


export default function collieWebpackLoader(
  this: LoaderContext<CollieConfig>,
  source: string
) {
  const options = this.getOptions();
  const {
    build: { include, exclude, entry, alias, root },
    css: cssConfig,
  } = options;
  const filter = createFilter(include, exclude);
  const url = this.resourcePath || "";
  if (shouldSkip(url, filter)) {
    return source;
  }
  let { code } = transform(source, url, cssConfig, alias, root);
  return code;
}
