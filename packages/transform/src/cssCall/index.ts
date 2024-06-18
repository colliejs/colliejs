import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { BaseConfig, extractFromCssObject } from "@colliejs/core";
import { ImportsByName } from "../utils";
import { parseCSSCallDeclaration } from "./parseCssCall";
export { isCssCallExpression } from "./parseCssCall";

export const extractCssFromCssCall = <C extends BaseConfig>(
  path: NodePath<t.CallExpression>,
  moduleIdByName: ImportsByName,
  config: C
) => {
  const cssObject = parseCSSCallDeclaration(path, moduleIdByName);
  return extractFromCssObject(cssObject, config);
};

