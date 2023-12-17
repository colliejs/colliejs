import type { BaseConfig, CSSObject } from "@colliejs/core";
import * as t from "@babel/types";
import log from "npmlog";
import {
  delAttr,
  getJSXElementName,
  getAttr,
  isPropExisted,
  getValExpOfAttr,
} from "../utils/index";
import { evalValueOfProp } from "./evalValueOfProp";

import { ImportsByName, Stylable } from "../utils/types";
import _ from "lodash";
import { NodePath } from "@babel/traverse";
import { styledElementCssPropName } from "../const";
import { convertCssProp } from "./convertCssProp";
import { CSSInfo } from "../type";

export class StyledElement<Config extends BaseConfig> implements Stylable {
  cssProp: CSSInfo<Config>;

  constructor(
    private path: NodePath<t.JSXElement>,
    importsByName: ImportsByName,
    private config: Config
  ) {
    if (!path.isJSXElement()) {
      log.error("StyledElement must be a JSXElement", path);
      throw new Error("StyledElement must be a JSXElement");
    }
    const css = evalValueOfProp(
      path,
      styledElementCssPropName,
      importsByName
    ) as CSSObject<Config>;
    if (!_.isObject(css)) {
      log.error("css prop must be a object", css);
      throw new Error("css prop must be a object");
    }
    this.cssProp = convertCssProp(css, config);
  }

  getCssText() {
    return this.cssProp.cssGenText;
  }

  transform() {
    //===========================================================
    // 合并className
    //===========================================================
    const isClassNameExisted = isPropExisted(this.path, "className");
    if (isClassNameExisted) {
      const classNameAttr = getAttr(this.path, "className");
      classNameAttr.replaceWith(
        t.jsxAttribute(
          t.jsxIdentifier("className"),
          t.jSXExpressionContainer(
            t.binaryExpression(
              "+",
              t.stringLiteral(` ${this.cssProp.className} `), //NOTE:这里必须要有个空格来分开className
              getValExpOfAttr(this.path, "className")
            )
          )
        )
      );
    } else {
      this.path.node.openingElement.attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier("className"),
          t.stringLiteral(this.cssProp.className)
        )
      );
    }

    //===========================================================
    // 处理CSS Props
    //===========================================================
    const name = styledElementCssPropName;
    const hasCssProp = isPropExisted(this.path, name);
    if (hasCssProp) {
      delAttr(this.path, name);

      //without css layer
      return {
        cssText: `${this.cssProp.cssGenText}`,
        path: this.path,
      };
    }
    throw new Error("not impossisble");
  }
}
