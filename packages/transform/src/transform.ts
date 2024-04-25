import type { BaseConfig } from "@colliejs/core";
import { STYLE_ELEMENT_PROP_NAME } from "./const";
import { StyledComponent } from "./styledComponent";
import { isStyledComponentDecl } from "./styledComponent/isStyledCompDelc";
import { StyledElement } from "./styledElement";
import { generate, getImports, traverse } from "./utils";
import { isPropExisted } from "./utils/jsx/prop";
import { parseCode } from "./utils/parse";
import { removeTypeAnnotation } from "./utils/removeType";
import log from "npmlog";

/**
 * NOTE: the module should be convert commonjs first
 */
export const transform = <Config extends BaseConfig>(
  source: string,
  curFile: string,
  config: Config,
  alias = {},
  root = process.cwd()
) => {
  try {
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
        styledComponent.transform();
        styledComponentCssTexts += styledComponent.getCssText() + "\n";
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

        const styledElement = new StyledElement(path, modulesByName, config);
        styledElement.transform();
        styledElementCssTexts += styledElement.getCssText() + "\n";
      },
    });
    //===========================================================
    // 4. generate code
    //===========================================================
    const { code } = generate(fileAst);

    return {
      code,
      layerDepsObject,
      styledElementCssTexts,
      styledComponentCssTexts,
    };
  } catch (e) {
    log.error(e.message, "===>[transform]:curFile=%s,", curFile);
    log.error(e.message, "===>[transform]:alias=%s,", alias);
    throw e;
  }
};
