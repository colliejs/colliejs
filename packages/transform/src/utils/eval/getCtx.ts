import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { ImportsByName, traverse } from "..";
import { evalIdentifer } from "./evalIdentifier";

//获得当前节点的所有变量和他的值
export const getCtxOf = (path: NodePath<t.Node>, imports: ImportsByName = {}) => {
  const ctx = {};
  traverse(path.node, {
    TSTypeAnnotation(path) {
      path.remove();
    },
    TypeAnnotation(path) {
      path.remove();
    },
    noScope: true,
  });

  path.traverse({
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
  });
  return ctx;
};
