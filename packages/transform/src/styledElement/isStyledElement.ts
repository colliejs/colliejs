import * as t from "@babel/types";
import { Config } from "@colliejs/core";
import { traverse } from "../utils/module";
import { isPropExisted } from "./prop";
import { StyledComponentDecl } from "../utils/types";
import { NodePath } from "@babel/traverse";

export const isStyledCallExpression = (
  exp: t.Expression
): exp is t.CallExpression => {
  return (
    t.isCallExpression(exp) &&
    exp.callee.type === "Identifier" &&
    exp.callee.name === "styled"
  );
};

/**
 *
 * @param node
 * @returns
 * @example:
 * const Button = styled('button',{})
 */
export const isStyledComponentDecl = (
  node: t.Node
): node is StyledComponentDecl => {
  if (t.isVariableDeclaration(node)) {
    const { declarations } = node;
    if (declarations.length === 1) {
      return (
        !!declarations[0].init && isStyledCallExpression(declarations[0].init)
      );
    }
  }
  return false;
};

export const isStyledElement = (
  path: NodePath<t.JSXElement>,
  propsName: string
) => {
  return isPropExisted(path, propsName);
};
