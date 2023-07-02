import * as t from "@babel/types";
import { ImportsByName, generate, isStyledComponentDecl } from "../utils";
import traverse, { NodePath } from "@babel/traverse";
import { evalIdentifer } from "../utils/eval/evalIdentifier";
import { evalCodeText } from "../utils/eval/eval";

export const getCtx = (
  objectExp: t.ObjectExpression,
  imports: ImportsByName = {},
  path: NodePath
) => {
  const ctx = {};
  traverse(objectExp, {
    TSTypeAnnotation(path) {
      path.remove();
    },
    TypeAnnotation(path) {
      path.remove();
    },
    noScope: true,
  });
  traverse(
    objectExp,
    {
      Identifier(ipath) {
        if (!ipath.isReferenced()) {
          return;
        }
        const ctx1 = {
          [ipath.node.name]: evalIdentifer(ipath, imports),
        };
        Object.assign(ctx, ctx1);
      },
    },
    path.scope, //scope
    path.node, //state
    path.parentPath! //parentPath
  );
  return ctx;
};

export const evalStyling = (
  stylingExp: t.ObjectExpression,
  imports: ImportsByName,
  path: NodePath
) => {
  const ctx = getCtx(stylingExp, imports, path);
  const code = generate(stylingExp).code;
  return evalCodeText(code, ctx);
};
