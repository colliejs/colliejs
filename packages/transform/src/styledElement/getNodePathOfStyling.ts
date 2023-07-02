import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
/**
 *
 * <Button css={{color:'red'}}>
 * @param path :
 */
export const getNodePathOfValueForStyledElement = (
  path: NodePath,
  propsName: string
) => {
  let res;
  path.traverse({
    JSXAttribute(ipath) {
      if (ipath.node.name.name !== propsName) {
        return;
      }
      ipath.traverse({
        StringLiteral(iipath) {
          res = iipath;
        },
        NumericLiteral(iipath) {
          res = iipath;
        },
        Identifier(iipath) {
          res = iipath;
        },
      });  
    },
  });
  return res;
};
