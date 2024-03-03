import type { BaseConfig } from "@colliejs/core";
import { parseCode } from "./utils/parse";
import { StyledComponent } from "./styledComponent";
import { isStyledComponentDecl } from "./styledComponent/isStyledCompDelc";
import { getImports, traverse } from "./utils";
import { removeTypeAnnotation } from "./utils/removeType";
import { isCssCallExpression } from "./cssCall/parseCssCall";
import * as t from "@babel/types";
import { isPropExisted } from "./utils/jsx/prop";
import { extractCssTextFromCssProps } from "./styledElement";
import { STYLE_ELEMENT_PROP_NAME } from "./const";

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
    JSXElement(path) {
      if (!isPropExisted(path, STYLE_ELEMENT_PROP_NAME)) {
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
      const { cssGenText } = extractCssTextFromCssProps(path, modulesByName, config);
      styledElementCssTexts += cssGenText + "\n";
    },
  });

  return {
    layerDepsObject,
    styledElementCssTexts,
    styledComponentCssTexts,
  };
};
