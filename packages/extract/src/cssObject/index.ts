import * as t from "@babel/types";
import { NodePath } from "@babel/traverse";
import { ImportsByName } from "../utils";
import { isCssCallExpression, parseCSSCallDeclaration } from "./parseCssCall";
import { extract } from "./extract";
import { BaseConfig } from "@colliejs/core";
export const extractCssObject = <C extends BaseConfig>(
  path: NodePath<t.CallExpression>,
  moduleIdByName: ImportsByName,
  config: C
) => {
  const cssObject = parseCSSCallDeclaration(path, moduleIdByName);
  return extract(cssObject, config);
};
