import type { BaseConfig } from "@colliejs/core";
import { traverse } from "./traverse";
import { generate } from "./utils";
import { noop } from "lodash-es";
import { extractCssFromCssCall } from "./cssCall";

/**
 * NOTE: the module should be convert commonjs first
 */
export const extractCss = <Config extends BaseConfig>(
  source: string,
  curFile: string,
  config: Config,
  alias = {},
  root = process.cwd()
) => {
  let styledComponentCssTexts = "";
  let cssCallCssTexts = "";
  traverse(
    source,
    curFile,
    config,
    alias,
    root,
    styledComponent => {
      styledComponentCssTexts += styledComponent.getCssText() + "\n";
    },
    noop,
    noop,
    (path, modulesByName, config) => {
      cssCallCssTexts += extractCssFromCssCall(
        path,
        modulesByName,
        config
      ).cssGenText;
    }
  );
  return {
    styledElementCssTexts: cssCallCssTexts,
    styledComponentCssTexts,
  };
};
