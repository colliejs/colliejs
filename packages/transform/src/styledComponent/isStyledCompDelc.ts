
import * as t from "@babel/types";
import { BaseConfig } from "@colliejs/core";
import { StyledComponentDecl } from "../utils";

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