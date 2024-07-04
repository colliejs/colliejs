import * as t from "@babel/types";
import { BaseConfig } from "@colliejs/core";
import { StyledComponentDecl, isCallExp } from "../utils";
import { STYLE_FN_NAME } from "../const";

export function isStyledCallExpression(
  exp: t.Expression
): exp is t.CallExpression {
  return isCallExp(exp, STYLE_FN_NAME);
}

/**
 *
 * @param node
 * @returns
 * @example:
 * const Button = styled('button',{})
 */
export function isStyledComponentDecl(
  node: t.Node
): node is StyledComponentDecl {
  if (t.isVariableDeclaration(node)) {
    const { declarations } = node;
    if (declarations.length === 1) {
      return (
        !!declarations[0].init && isStyledCallExpression(declarations[0].init)
      );
    }
  }
  return false;
}
