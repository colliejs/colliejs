import { Config, CSSPropertiesComplex } from "@colliejs/core";
import * as t from "@babel/types";
import log from "npmlog";
import {
  delProp,
  getJSXElementName,
  getProp,
  getPropValue,
  isPropExisted,
} from "../utils/index";

import { ImportsByName, Stylable } from "../utils/types";
import { parseCssProp } from "../styling/styling";
import { CSSInfo } from "../styling/types";
import _ from "lodash";

export class StyledElement implements Stylable {
  cssProp: CSSInfo;

  constructor(
    public jsxElement: t.JSXElement,
    public importsByName: ImportsByName,
    public fileAst: t.File,
    config: Config
  ) {
    if (!t.isJSXElement(jsxElement)) {
      log.error("StyledElement must be a JSXElement", jsxElement);
      throw new Error("StyledElement must be a JSXElement");
    }
    const css = (getPropValue(this.jsxElement, "css", importsByName, fileAst) ||
      {}) as CSSPropertiesComplex;
    if (!_.isObject(css)) {
      log.error("css prop must be a object", css);
      throw new Error("css prop must be a object");
    }
    this.cssProp = parseCssProp(css, config);
  }

  getCssText() {
    return this.cssProp.cssText;
  }

  get classnames(): string[] {
    const className = getPropValue(
      this.jsxElement,
      "className",
      this.importsByName,
      this.fileAst
    ) as string;
    return [className || "", this.cssProp.className];
  }

  transform() {
    //添加classname
    const className = this.classnames.join(" ").trim();
    const newClassNnewClassNameAmeAttr = t.jsxAttribute(
      t.jsxIdentifier("className"),
      t.stringLiteral(className)
    );
    delProp(this.jsxElement, "className");
    this.jsxElement.openingElement.attributes.push(
      newClassNnewClassNameAmeAttr
    );

    //删除css
    const hasCssProp = isPropExisted(this.jsxElement, "css");
    if (hasCssProp) {
      delProp(this.jsxElement, "css");
      const cssFileName = `${getJSXElementName(this.jsxElement)}-${
        this.cssProp.className
      }.css`;

      //without css layer
      const cssText = `${this.cssProp.cssText}`;
      return {
        ast: this.jsxElement,
        cssFileName,
        cssText,
      };
    }

    return { ast: this.jsxElement };
  }
}
