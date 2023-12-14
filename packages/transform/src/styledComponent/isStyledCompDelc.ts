import * as t from "@babel/types";
import { BaseConfig } from "@colliejs/core";
import { StyledComponentDecl } from "../utils";
export const isStyledCallExpression = <Config extends BaseConfig>(
  exp: t.Expression,
  config: Config
): exp is t.CallExpression => {
  return (
    t.isCallExpression(exp) &&
    exp.callee.type === "Identifier" &&
    exp.callee.name === (config.styledFunctionName || "styled")
  );
};

/**
 *
 * @param node
 * @returns
 * @example:
 * const Button = styled('button',{})
 */
export const isStyledComponentDecl = <Config extends BaseConfig>(
  node: t.Node,
  config: Config
): node is StyledComponentDecl => {
  if (t.isVariableDeclaration(node)) {
    const { declarations } = node;
    if (declarations.length === 1) {
      return (
        !!declarations[0].init &&
        isStyledCallExpression(declarations[0].init, config)
      );
    }
  }
  return false;
};
