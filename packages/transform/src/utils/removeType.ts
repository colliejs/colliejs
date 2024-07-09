import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
export function removeTypeAnnotation(path: NodePath<t.Node>) {
  path.traverse({
    TypeAnnotation(ipath) {
      ipath.remove();
    },
    TSTypeAnnotation(ipath) {
      ipath.remove();
    },
    TSAsExpression(ipath) {
      ipath.replaceWith(ipath.node.expression);
    },
    TSTypeAssertion(ipath) {
      ipath.remove();
    },

    // 删除接口、类型别名、枚举声明
    TSInterfaceDeclaration(path) {
      path.remove();
    },
    TSTypeAliasDeclaration(path) {
      path.remove();
    },
    TSEnumDeclaration(path) {
      path.remove();
    },
    // 删除类型参数
    TSTypeParameterDeclaration(path) {
      path.remove();
    },

    // 删除函数返回类型注解
    TSFunctionType(path) {
      path.remove();
    },
  });
}
