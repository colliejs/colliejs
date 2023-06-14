import * as t from "@babel/types";
import { traverse } from "./module";
import { getProp, isPropExisted } from "./prop";
import { StyledComponentDecl } from "./types";

export const getInitOfDecl = (
  decl: t.VariableDeclaration
): t.Expression | undefined | null => {
  const { declarations } = decl;
  if (declarations.length > 0) {
    const { init } = declarations[0];
    return init;
  }
};

export function getVariableDeclarator(ast: t.Node, name: string) {
  let result: t.VariableDeclarator | undefined;
  traverse(ast, {
    VariableDeclaration: path => {
      const { node } = path;
      for (const decl of node.declarations) {
        if (decl.id.type === "Identifier" && decl.id.name === name) {
          result = decl;
        }
      }
    },
  });
  return result;
}

export const getVariableValueInFile = (ast: t.File, name: string) => {
  const decl = getVariableDeclarator(ast, name);
  if (decl) {
    //TODO:考虑更多的情况
    /**
     * @example
     * import {a} from 'xx';
     * const b = a; //考虑这种情况。需要把a先计算出来
     */
    // switch(decl.init?.type){
    //   case 'StringLiteral':
    //   case 'NumericLiteral':
    //   case 'BooleanLiteral':
    //   case 'NullLiteral':
    //   case 'Identifier':
    //     return decl.init;
    // }
    // if(t.isObjectExpression(decl.init)){
    //   return decl.init;
    // }
    return decl.init;
  }
};

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

export const isStyledElement = (ele: t.JSXElement) => {
  return isPropExisted(ele, "css");
};
