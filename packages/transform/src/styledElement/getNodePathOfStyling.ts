import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
/**
 *
 * <Button css={{color:'red'}}>
 * @param path :
 */

//TODO: boolean类型会被当做null
export const getPathOfValueForStyledElement = (
  path: NodePath<t.JSXElement>,
  propsName: string
) => {
  let res: NodePath | undefined = undefined;
  path.traverse({
    JSXAttribute(ipath) {
      if (ipath.node.name.name !== propsName) {
        return;
      }
      switch (ipath.node.value.type) {
        case "JSXExpressionContainer":
          res = ipath.get("value.expression") as NodePath;
          break;
        default:
          res = ipath.get("value");
      }
    },
  });
  return res;
};
