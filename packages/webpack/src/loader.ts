import { transform, Alias } from "@colliejs/transform";
import { urlToRequest } from "loader-utils";
import { Config, defaultConfig } from "@colliejs/core";
import {
  LoaderContext,
  LoaderDefinition,
  LoaderDefinitionFunction,
} from "webpack";

import { FilterPattern, createFilter } from "@rollup/pluginutils";

/**
 * 
 * @param code   styledConfig?: Config;
  alias?: Alias;
  root?: string;
 * @returns 
 */
type LoaderOption = {
  styledConfig?: Config;
  alias?: Alias;
  root?: string;
  include?: FilterPattern;
  exclude?: FilterPattern;
};
export default function collieWebpackLoader(
  this: LoaderContext<LoaderOption>,
  code: string
) {
  const options = this.getOptions();

  const {
    styledConfig = defaultConfig,
    alias = {},
    root = process.cwd(),
    include,
    exclude,
  } = options;
  const filter = createFilter(include, exclude);
  const url = urlToRequest(this.resourcePath);
  if (
    url.includes("node_modules") ||
    !filter(url) ||
    !/\.[cm]?[tj]sx?$/.test(url)
  ) {
    return code;
  }

  console.log("===>url", url);
  let { code: transformedCode } = transform(
    code,
    url,
    styledConfig,
    alias,
    root
  );

  return transformedCode;
}
