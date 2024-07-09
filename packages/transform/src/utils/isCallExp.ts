import * as t from "@babel/types";

export function isCallExp(
  exp: t.Expression,
  fnName: string
): exp is t.CallExpression {
  return (
    t.isCallExpression(exp) &&
    exp.callee.type === "Identifier" &&
    exp.callee.name === fnName
  );
}
