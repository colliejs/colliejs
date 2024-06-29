import * as t from "@babel/types";
import log from "npmlog";
import {
  type BaseConfig,
  extractFromCssObject,
  CSSObject,
  CSSObjectResult,
} from "@colliejs/core";
import { getPropValue } from "../utils/jsx/getPropVal";

import { ImportsByName, Stylable } from "../utils/types";
import _ from "lodash-es";
import { NodePath } from "@babel/traverse";
import { STYLE_ELEMENT_PROP_NAME } from "../const";
import {
  delAttr,
  getAttr,
  getValExpOfAttr,
  isPropExisted,
} from "../utils/jsx/prop";

export class StyledElement<Config extends BaseConfig> implements Stylable {
  cssObjectResult: CSSObjectResult<Config>;

  constructor(
    private path: NodePath<t.JSXElement>,
    importsByName: ImportsByName,
    private config: Config
  ) {
    if (!path.isJSXElement()) {
      log.error("StyledElement must be a JSXElement", path);
      throw new Error("StyledElement must be a JSXElement");
    }
    const cssObject: CSSObject<Config> = getPropValue(
      path,
      STYLE_ELEMENT_PROP_NAME,
      importsByName
    );
    if (!_.isObject(cssObject)) {
      log.error("css prop must be a object", JSON.stringify(cssObject));
      throw new Error("css prop must be a object");
    }
    this.cssObjectResult = extractFromCssObject(cssObject, config);
  }

  getCssText() {
    return this.cssObjectResult.cssGenText;
  }

  transform() {
    //===========================================================
    // 1.合并className
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
              t.stringLiteral(` ${this.cssObjectResult.className} `), //NOTE:这里必须要有个空格来分开className
              getValExpOfAttr(this.path, "className")
            )
          )
        )
      );
    } else {
      this.path.node.openingElement.attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier("className"),
          t.stringLiteral(this.cssObjectResult.className)
        )
      );
    }

    //===========================================================
    // 2.delete CSS Props
    //===========================================================
    const hasCssProp = isPropExisted(this.path, STYLE_ELEMENT_PROP_NAME);
    if (hasCssProp) {
      delAttr(this.path, STYLE_ELEMENT_PROP_NAME);
      return;
    }
    throw new Error("not impossisble");
  }
}
