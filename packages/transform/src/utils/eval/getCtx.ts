
import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
    ImportsByName,
    traverse
} from "..";
import { evalIdentifer } from "./evalIdentifier";

export const getCtx = (
    exp: t.Node,
    imports: ImportsByName = {},
    path: NodePath
  ) => {
    const ctx = {};
    traverse(exp, {
      TSTypeAnnotation(path) {
        path.remove();
      },
      TypeAnnotation(path) {
        path.remove();
      },
      noScope: true,
    });
    traverse(
      exp,
      {
        Identifier(ipath) {
          if (!ipath.isReferenced()) {
            return;
          }
          //===========================================================
          // 是函数参数
          // return语句中x是函数参数，需要忽略
          // {foo:(x)=>{return x+1} }
          //===========================================================
  
          if (ipath.scope.getBinding(ipath.node.name)?.kind === "param") {
            return;
          }
          const _ctx = {
            [ipath.node.name]: evalIdentifer(ipath, imports),
          };
          Object.assign(ctx, _ctx);
        },
      },
      path.scope, //scope
      path.node, //state
      path.parentPath! //parentPath
    );
    return ctx;
  };