import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
export const removeTypeAnnotation = (path: NodePath<t.Node>) => {
  path.traverse({
    TypeAnnotation(ipath) {
      ipath.remove();
    },
    TSTypeAnnotation(ipath) {
      ipath.remove();
    },
    TSAsExpression(ipath) {
      ipath.remove();
    },
  });
};
