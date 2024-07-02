import type { BaseConfig } from "@colliejs/core";
import { STYLE_ELEMENT_PROP_NAME } from "./const";
import { StyledComponent } from "./styledComponent";
import { isStyledComponentDecl } from "./styledComponent/isStyledCompDelc";
import { StyledElement } from "./styledElement";
import { generate, getImports, traverse as _traverse, ImportsByName } from "./utils";
import { isPropExisted } from "./utils/jsx/prop";
import { parseCode } from "./utils/parse";
import { removeTypeAnnotation } from "./utils/removeType";
import log from "npmlog";
import { parse } from "@babel/parser";
import { isCssCallExpression } from "./cssCall";
import { CallExpression } from "@babel/types";
import * as t from "@babel/types";
import { NodePath } from "@babel/traverse";

/**
 * NOTE: the module should be convert commonjs first
 */
export const traverse = <Config extends BaseConfig>(
  source: string,
  curFile: string,
  config: Config,
  alias = {},
  projectDir = process.cwd(),
  onStyledComponent: (styledComponent: StyledComponent<Config>) => void,
  onStyledElement: (styledElement: StyledElement<Config>) => void,
  onGenerate?: (fileAst: ReturnType<typeof parse>) => void,
  onCssFnCall?: (
    exp: NodePath<t.CallExpression>,
    modulesByName: ImportsByName,
    config: Config
  ) => void
) => {
  try {
    const fileAst = parseCode(source);
    let modulesByName = {};
    _traverse(fileAst, {
      //===========================================================
      // 1.transform styled component
      //===========================================================
      VariableDeclaration(path) {
        if (!isStyledComponentDecl(path.node, config)) {
          return;
        }
        if (Object.keys(modulesByName).length === 0) {
          modulesByName = getImports(fileAst.program, curFile, alias, projectDir);
        }

        removeTypeAnnotation(path);
        const styledComponent = new StyledComponent(
          path,
          curFile,
          modulesByName,
          config,
          alias,
          projectDir
        );
        onStyledComponent(styledComponent);
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
            projectDir
          );
        }
        removeTypeAnnotation(path);
        const styledElement = new StyledElement(path, modulesByName, config);
        onStyledElement(styledElement);
      },
      //3. css() call
      CallExpression(path) {
        if (!isCssCallExpression(path.node)) {
          return;
        }
        if (Object.keys(modulesByName).length === 0) {
          modulesByName = getImports(
            parseCode(source).program,
            curFile,
            alias,
            projectDir
          );
        }
        onCssFnCall?.(path, modulesByName, config);
      },
    });
    //===========================================================
    // 4. generate code
    //===========================================================
    return onGenerate?.(fileAst);
  } catch (e) {
    log.error(e.message, "===>[transform]:curFile=%s,", curFile);
    log.error(e.message, "===>[transform]:alias=%s,", alias);
    throw e;
  }
};
