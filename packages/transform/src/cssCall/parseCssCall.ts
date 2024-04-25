import { NodePath } from "@babel/traverse";
import { ImportsByName, getArgPathOfFnCall } from "..";
import * as t from "@babel/types";
import { BaseConfig, CSSObject } from "@colliejs/core";
import { CSS_FN_NAME } from "../const";
import { isCallExp } from "../utils/isCallExp";
import { evalObjectExp } from "../utils/eval/evalObjectExp";
import { assert } from "@colliejs/shared";

export const isCssCallExpression = <Config extends BaseConfig>(
  exp: t.Expression
): exp is t.CallExpression => {
  return isCallExp(exp, CSS_FN_NAME);
};

export const parseCSSCallDeclaration = <Config extends BaseConfig>(
  path: NodePath<t.CallExpression>,
  moduleIdByName: ImportsByName
): CSSObject<Config> => {
  if (!isCssCallExpression(path.node)) {
    throw new Error("not a cssObjectDecl");
  }
  const cssObjectPath = getArgPathOfFnCall(path, CSS_FN_NAME, 0);
  assert(!!cssObjectPath, "cssObjectPath should not be undefined");
  return evalObjectExp(cssObjectPath, moduleIdByName);
};
