import { transform, Alias } from "@colliejs/transform";
import { urlToRequest } from "loader-utils";
import { Config, defaultConfig } from "@colliejs/core";
import {
  LoaderContext,
  LoaderDefinition,
  LoaderDefinitionFunction,
} from "webpack";

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
  } = options;

  const url = urlToRequest(this.resourcePath);
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
