import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
/**
 *
 * @param styledComponentPath :styled()函数变量声明的Node
 */
export const getNodePathOfStyling = (styledComponentPath: NodePath) => {
  //@ts-ignore
  let res: NodePath = undefined;
  styledComponentPath.traverse({
    ObjectExpression(ipath) {
      if (
        ipath.parentPath.node.type === "CallExpression" &&
        //@ts-ignore
        ipath.parentPath.node.callee?.name === "styled" &&
        t.isNodesEquivalent(ipath.parentPath.node.arguments[1], ipath.node)
      ) {
        res = ipath;
      }
    },
  });
  return res;
};
