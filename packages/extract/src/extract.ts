import type { BaseConfig } from "@colliejs/core";
import { parseCode } from "./utils/parse";
import { StyledComponent } from "./styledComponent";
import { isStyledComponentDecl } from "./styledComponent/isStyledCompDelc";
import { getImports, traverse } from "./utils";
import { removeTypeAnnotation } from "./utils/removeType";
import { isCssCallExpression } from "./cssObject/parseCssCall";
import { extractCssObject } from "./cssObject";
import * as t from "@babel/types";

export const styledElementProp = "css";
/**
 * NOTE: the module should be convert commonjs first
 */
export const extract = <Config extends BaseConfig>(
  source: string,
  curFile: string,
  config: Config,
  alias = {},
  root = process.cwd()
) => {
  const fileAst = parseCode(source);
  let styledComponentCssTexts = "";
  let styledElementCssTexts = "";
  const layerDepsObject: Record<string, string> = {};
  let modulesByName = {};

  traverse(fileAst, {
    //===========================================================
    // 1.transform styled component
    //===========================================================
    VariableDeclaration(path) {
      if (!isStyledComponentDecl(path.node, config)) {
        return;
      }
      if (Object.keys(modulesByName).length === 0) {
        modulesByName = getImports(fileAst.program, curFile, alias, root);
      }

      removeTypeAnnotation(path);

      const styledComponent = new StyledComponent(
        path,
        curFile,
        modulesByName,
        config,
        alias,
        root,
        true
      );
      const cssText = styledComponent.getCssText();
      styledComponentCssTexts += cssText + "\n";
      layerDepsObject[styledComponent.layerName] =
        styledComponent.directLayerDep;
    },

    //===========================================================
    // 2.transform styled element
    //===========================================================
    CallExpression(path) {
      if (!isCssCallExpression(path.node)) {
        return;
      }
      if (Object.keys(modulesByName).length === 0) {
        modulesByName = getImports(
          parseCode(source).program,
          curFile,
          alias,
          root
        );
      }
      removeTypeAnnotation(path);
      const { cssGenText } = extractCssObject(path, modulesByName, config);
      styledElementCssTexts += cssGenText + "\n";
    },
  });

  return {
    layerDepsObject,
    styledElementCssTexts,
    styledComponentCssTexts,
  };
};
