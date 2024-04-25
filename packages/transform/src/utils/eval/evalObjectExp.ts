import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { assert } from "@colliejs/shared";
import { ImportsByName, generate } from "..";
import { getCtxOf } from "./getCtx";
import { evalExpText } from "./evalText";

export const evalObjectExp = (
  path: NodePath<t.ObjectExpression>,
  imports: ImportsByName
) => {
  assert(path.isObjectExpression(), "path is not object expression", { path });
  const stylingExp = path.node;
  const ctx = getCtxOf(path, imports);
  const code = generate(stylingExp).code;
  return evalExpText(code, ctx);
};
