import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
/**
 *
 * @param parentPath :styled()函数变量声明的Node
 */
export const getArgPathOfFnCall = (
  parentPath: NodePath<t.Node>,
  fnName: string,
  argIndex: number
) => {
  let res: NodePath<t.ObjectExpression> | undefined = undefined;
  parentPath.traverse({
    ObjectExpression(ipath) {
      if (
        ipath.parentPath.node.type === "CallExpression" &&
        //@ts-ignore
        ipath.parentPath.node.callee?.name === fnName &&
        t.isNodesEquivalent(ipath.parentPath.node.arguments[argIndex], ipath.node)
      ) {
        res = ipath;
        ipath.stop();
      }
    },
  });
  return res;
};
