import { Config, CSSPropertiesComplex } from "@colliejs/core";
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
import { parseCssProp } from "../styling/styling";
import { CSSInfo } from "../styling/types";
import _ from "lodash";
import { NodePath } from "@babel/traverse";

export class StyledElement implements Stylable {
  cssProp: CSSInfo;

  constructor(
    private path: NodePath<t.JSXElement>,
    private importsByName: ImportsByName,
    private config: Config
  ) {
    if (!path.isJSXElement()) {
      log.error("StyledElement must be a JSXElement", path);
      throw new Error("StyledElement must be a JSXElement");
    }
    const css = (evalValueOfProp(
      path,
      config.styledElementProp || "css",
      importsByName
    ) || {}) as CSSPropertiesComplex;
    if (!_.isObject(css)) {
      log.error("css prop must be a object", css);
      throw new Error("css prop must be a object");
    }
    this.cssProp = parseCssProp(css, config);
  }

  getCssText() {
    return this.cssProp.cssGenText;
  }

  transform() {
    //===========================================================
    // 合并className
    //===========================================================
    const isClassNameExisted = isPropExisted(this.path, "className");
    const classNameAttr = getAttr(this.path, "className");
    const valueOfClassName = isClassNameExisted
      ? t.jSXExpressionContainer(
          t.binaryExpression(
            "+",
            t.stringLiteral(this.cssProp.className),
            getValExpOfAttr(this.path, "className")
          )
        )
      : t.stringLiteral(this.cssProp.className);

    if (isClassNameExisted) {
      classNameAttr.replaceWith(
        t.jsxAttribute(t.jsxIdentifier("className"), valueOfClassName)
      );
    } else {
      this.path.node.openingElement.attributes.push(
        t.jsxAttribute(t.jsxIdentifier("className"), valueOfClassName)
      );
    }

    //===========================================================
    // 处理CSS Props
    //===========================================================
    const name = this.config.styledElementProp || "css";
    const hasCssProp = isPropExisted(this.path, name);
    if (hasCssProp) {
      delAttr(this.path, name);
      const cssFileName = `${getJSXElementName(this.path.node)}-${
        this.cssProp.className
      }.css`;

      //without css layer
      const cssText = `${this.cssProp.cssGenText}`;
      return {
        cssText,
        path: this.path,
      };
    }
    throw new Error("not impossisble");
  }
}
