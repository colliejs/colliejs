import * as t from "@babel/types";
import { NodePath } from "@babel/traverse";
import { BaseConfig, createTheme } from "@colliejs/core";
import { evalObjectExp } from "../utils/eval/evalObjectExp";
import { ImportsByName } from "../utils";
export const compileCreateTheme = (
  path: NodePath<t.CallExpression>,
  imports: ImportsByName,
  prefix: string
) => {
  const objExpPath = path.get("arguments")?.[0];
  if (!t.isObjectExpression(objExpPath.node)) {
    throw new Error("createTheme's first argument should be an object");
  }
  const themeObject = evalObjectExp(
    objExpPath as NodePath<t.ObjectExpression>,
    imports
  );
  return {
    cssGenText: createTheme(prefix, themeObject),
    cssRawObj: themeObject,
  };
};
