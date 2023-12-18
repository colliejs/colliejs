import * as t from "@babel/types";
import type { BaseConfig } from "@colliejs/core";
import log from "npmlog";
import { Component } from "../component/Component";
import CustomComponent from "../component/CustomComponent";
import { HostComponent } from "../component/HostComponent";
import { convertStyledObject } from "./styledObject/convertStyledObject";
import type { DynamicClassNameMap } from "./type";

import { buildObjectExpression } from "../utils/index";
import { ImportsByName, Stylable, StyledComponentDecl } from "../utils/types";
import { parseStyledComponentDeclaration as parseStyledComponentDecl } from "./parseStyledComponent";
import { NodePath } from "@babel/traverse";
import { ComponentId } from "../component/componentId";
import { findLayerDeps } from "./findDeps";
import { isStyledComponentDecl } from "./isStyledCompDelc";
import { StyledObjectParsed, StyledObject } from "./styledObject/types";
import {
  CompoundVariantKeyPrefix,
  DynamicVariantKeyPrefix,
  StaticVariantKeyPrefix,
  VariantsType,
} from "./styledObject/variants";
import { Alias } from "../type";

export class StyledComponent<Config extends BaseConfig>
  extends CustomComponent
  implements Stylable
{
  stylingParsed: StyledObjectParsed<Config>;
  dependent: CustomComponent | HostComponent;
  styling: StyledObject<Config>;
  layerDeps: string[];

  constructor(
    public path: NodePath<t.VariableDeclaration>,
    moduleId: string,
    moduleIdByName: ImportsByName,
    public config: Config,
    alias: Alias = {},
    root: string = process.cwd(),
    getDeps = false
  ) {
    if (!isStyledComponentDecl) {
      log.error("not a styledComponentDecl", "ast", path);
      throw new Error("not a styledComponentDecl");
    }

    const { styledComponentName, dependent, styling } =
      parseStyledComponentDecl<Config>(path, moduleIdByName, moduleId, config);
    super(new ComponentId(moduleId, styledComponentName));

    this.styling = styling;
    this.stylingParsed = convertStyledObject(
      styling,
      config,
      styledComponentName
    );
    this.dependent = dependent;
    if (getDeps) {
      this.layerDeps = findLayerDeps(this, alias, root, config);
    }
  }

  getCssText() {
    let cssText = this.stylingParsed.baseStyle.cssGenText;
    //NOTE: should make sure the order
    const keys = Object.keys(this.stylingParsed);
    for (const key of keys) {
      if (
        key.startsWith(StaticVariantKeyPrefix) ||
        key.startsWith(DynamicVariantKeyPrefix)
      ) {
        cssText += this.stylingParsed[key].cssGenText + "\n";
      }
    }
    for (const key of keys) {
      if (key.startsWith(CompoundVariantKeyPrefix)) {
        cssText += this.stylingParsed[key].cssGenText + "\n";
      }
    }
    const thisLayerName = this.config.layername
      ? `${this.config.layername}.${this.layerName}`
      : this.layerName;
    if (this.dependent instanceof CustomComponent) {
      return `
      @layer ${this.layerDeps
        .reverse()
        .map(e => (this.config.layername ? `${this.config.layername}.${e}` : e))
        .join(",")}, ${thisLayerName};
      @layer ${thisLayerName} {
        ${cssText}
      }\n`;
    }
    return `@layer ${thisLayerName} {${cssText}}\n`;
  }

  //TODO：三方组件支持自定义LayerName
  // cssLayerDep() {
  //   return {
  //     [this.layerName]:
  //       this.dependent instanceof CustomComponent
  //         ? this.dependent.layerName
  //         : "", //HostComponent没有LayerName
  //   };
  // }
  /**
   * @description
   * @example
   * change ```javascript
   *  const StyledButton = styled(button,{color:'red'},option)
   * ```
   *
   *  变为
   *  const StyledButton = styled(
   *    button,
   *    __classNameOfBaseStyle，
   *    __classNameOfStaticVariant:string[],
   *    __classNameOfDynamicVariant:Record<string, {canAddPx:boolean}>,
   *    __classNameOfCompoundVariants:string[]，
   *    option
   * )
   */
  transform() {
    const classNamesOfStaticVariant: VariantsType["staticClassName"][] = [];
    const classNameMapOfDynamicVariant: DynamicClassNameMap = {};
    const classNamesOfCompoundVariants: VariantsType["compoundClassName"][] =
      [];
    for (const key of Object.keys(this.stylingParsed)) {
      //===========================================================
      // 1.1.static variants
      //===========================================================
      if (key.startsWith("static-variants")) {
        classNamesOfStaticVariant.push(this.stylingParsed[key].className);
      }
      //===========================================================
      // 1.2.dynamic variants
      //===========================================================
      if (key.startsWith("dynamic-variants")) {
        const item = this.stylingParsed[key as VariantsType["dynamicKey"]];
        classNameMapOfDynamicVariant[item.className] = {
          canAddPx: item.canAddPx,
        };
      }
      //===========================================================
      // 2.compoundVariants
      //===========================================================
      if (key.startsWith("compoundVariants")) {
        classNamesOfCompoundVariants.push(this.stylingParsed[key].className);
      }
    }

    //===========================================================
    // 3.classnameOfbaseStyle
    //===========================================================
    let classNameOfBaseStyle = "";
    if (Object.keys(this.stylingParsed.baseStyle.cssRawObj).length !== 0) {
      classNameOfBaseStyle = `${this.stylingParsed.baseStyle.className}`;
    }

    //===========================================================
    // 4. replace styling to classNames
    //===========================================================
    const args = (this.path.node.declarations[0].init as t.CallExpression)
      .arguments;
    args.splice(1, 1); //remove styling
    args.splice(1, 0, t.stringLiteral(classNameOfBaseStyle)); //add classNameOfBaseStyle
    args.splice(2, 0, buildObjectExpression(classNamesOfStaticVariant)); //add classNameOfStaticVariant
    console.log(classNameMapOfDynamicVariant);
    args.splice(3, 0, buildObjectExpression(classNameMapOfDynamicVariant)); //add classNameMapOfDynamicVariant
    args.splice(4, 0, buildObjectExpression(classNamesOfCompoundVariants)); //add classNamesOfCompoundVariants

    //5. return
    return { cssText: this.getCssText(), path: this.path };
  }
}
