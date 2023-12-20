import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";

export const isCallCreateTheme = (path: NodePath<t.CallExpression>) => {
  if (!t.isCallExpression(path.node)) {
    return false;
  }
  const callee = path.node?.callee;
  if (t.isIdentifier(callee)) {
    return callee.name === "createTheme";
  }
  return false;
};
