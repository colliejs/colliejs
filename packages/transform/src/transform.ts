import type { BaseConfig } from "@colliejs/core";
import { traverse } from "./traverse";
import { generate } from "./utils";
/**
 * NOTE: the module should be convert commonjs first
 */
export function transform<Config extends BaseConfig>(
  source: string,
  curFile: string,
  config: Config,
  alias = {},
  root = process.cwd()
) {
  let styledComponentCssTexts = "";
  let styledElementCssTexts = "";
  const layerDepsObject: Record<string, string> = {};
  let code = "";

  traverse(
    source,
    curFile,
    config,
    alias,
    root,
    styledComponent => {
      styledComponent.transform();
      styledComponentCssTexts += styledComponent.getCssText() + "\n";
      layerDepsObject[styledComponent.layerName] =
        styledComponent.directLayerDep;
    },
    styledElement => {
      styledElement.transform();
      styledElementCssTexts += styledElement.getCssText() + "\n";
    },
    fileAst => {
      code = generate(fileAst).code;
    }
  );
  return {
    code,
    layerDepsObject,
    styledElementCssTexts,
    styledComponentCssTexts,
  };
}
