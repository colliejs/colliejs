import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
/**
 *
 * <Button css={{color:'red'}}>
 * @param path :
 */
export const getNodePathOfValueForStyledElement = <T = t.Node>(
  path: NodePath<t.JSXElement>,
  propsName: string
) => {
  //@ts-ignore
  let res: NodePath = undefined;
  path.traverse({
    JSXAttribute(ipath) {
      if (ipath.node.name.name !== propsName) {
        return;
      }
      res = ipath.get("value.expression") as NodePath;
    },
  });
  return res;
};
